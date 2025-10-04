import express from "express"
import Expense from "../models/Expense.js"
import Company from "../models/Company.js"
import ApprovalRule from "../models/ApprovalRule.js"
import User from "../models/User.js"
import { authenticate, authorize } from "../middleware/auth.js"
import axios from "axios"

const router = express.Router()

// Helper function to convert currency
async function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return amount
  }

  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
    const rate = response.data.rates[toCurrency]
    return amount * rate
  } catch (error) {
    console.error("Currency conversion error:", error)
    return amount
  }
}

// Helper function to determine approval sequence
async function determineApprovalSequence(expense, companyId) {
  const rules = await ApprovalRule.find({
    companyId,
    isActive: true,
  }).sort({ createdAt: 1 })

  for (const rule of rules) {
    // Check if rule applies to this expense
    const amountMatches =
      expense.convertedAmount >= rule.minAmount &&
      (rule.maxAmount === null || expense.convertedAmount <= rule.maxAmount)

    const categoryMatches = rule.categories.length === 0 || rule.categories.includes(expense.category)

    if (amountMatches && categoryMatches) {
      return rule
    }
  }

  // Default: Manager approval
  const employee = await User.findById(expense.employeeId)
  if (employee.managerId) {
    return {
      type: "Sequential",
      sequence: [{ level: 0, approverId: employee.managerId }],
    }
  }

  return null
}

// Create expense
router.post("/create", authenticate, async (req, res) => {
  try {
    const { amount, currency, category, description, date, receiptUrl } = req.body

    // Get company currency
    const company = await Company.findById(req.user.companyId)
    const convertedAmount = await convertCurrency(amount, currency, company.currency)

    // Create expense
    const expense = new Expense({
      employeeId: req.user._id,
      companyId: req.user.companyId,
      amount,
      currency,
      convertedAmount,
      category,
      description,
      date,
      receiptUrl: receiptUrl || "",
      status: "Pending",
    })

    // Determine approval sequence
    const approvalRule = await determineApprovalSequence(expense, req.user.companyId)

    if (approvalRule) {
      if (approvalRule.type === "Sequential" || approvalRule.type === "Hybrid") {
        expense.approvals = approvalRule.sequence.map((seq) => ({
          approverId: seq.approverId,
          status: "Pending",
        }))
      } else if (approvalRule.type === "SpecificApprover") {
        expense.approvals = [
          {
            approverId: approvalRule.specificApproverId,
            status: "Pending",
          },
        ]
      }
      expense.status = "In Review"
    }

    await expense.save()

    res.status(201).json({
      message: "Expense created successfully",
      expense,
    })
  } catch (error) {
    console.error("Create expense error:", error)
    res.status(500).json({ message: "Server error creating expense" })
  }
})

// Get my expenses (Employee)
router.get("/my-expenses", authenticate, async (req, res) => {
  try {
    const expenses = await Expense.find({ employeeId: req.user._id })
      .populate("approvals.approverId", "name email")
      .populate("comments.userId", "name")
      .sort({ createdAt: -1 })

    res.json({ expenses })
  } catch (error) {
    console.error("Get my expenses error:", error)
    res.status(500).json({ message: "Server error fetching expenses" })
  }
})

// Get pending approvals (Manager/Admin)
router.get("/pending-approvals", authenticate, authorize("Manager", "Admin"), async (req, res) => {
  try {
    const expenses = await Expense.find({
      companyId: req.user.companyId,
      status: "In Review",
      "approvals.approverId": req.user._id,
      "approvals.status": "Pending",
    })
      .populate("employeeId", "name email")
      .populate("approvals.approverId", "name email")
      .sort({ createdAt: -1 })

    res.json({ expenses })
  } catch (error) {
    console.error("Get pending approvals error:", error)
    res.status(500).json({ message: "Server error fetching pending approvals" })
  }
})

// Get team expenses (Manager)
router.get("/team-expenses", authenticate, authorize("Manager", "Admin"), async (req, res) => {
  try {
    // Get team members
    const teamMembers = await User.find({
      managerId: req.user._id,
      companyId: req.user.companyId,
    })

    const teamMemberIds = teamMembers.map((member) => member._id)

    const expenses = await Expense.find({
      employeeId: { $in: teamMemberIds },
    })
      .populate("employeeId", "name email")
      .populate("approvals.approverId", "name email")
      .sort({ createdAt: -1 })

    res.json({ expenses })
  } catch (error) {
    console.error("Get team expenses error:", error)
    res.status(500).json({ message: "Server error fetching team expenses" })
  }
})

// Get all expenses (Admin)
router.get("/all", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const expenses = await Expense.find({ companyId: req.user.companyId })
      .populate("employeeId", "name email")
      .populate("approvals.approverId", "name email")
      .sort({ createdAt: -1 })

    res.json({ expenses })
  } catch (error) {
    console.error("Get all expenses error:", error)
    res.status(500).json({ message: "Server error fetching expenses" })
  }
})

// Get expense history with filters
router.get("/history", authenticate, async (req, res) => {
  try {
    const { status, startDate, endDate, category } = req.query

    const query = {}

    // Role-based filtering
    if (req.user.role === "Employee") {
      query.employeeId = req.user._id
    } else if (req.user.role === "Manager") {
      const teamMembers = await User.find({
        managerId: req.user._id,
        companyId: req.user.companyId,
      })
      const teamMemberIds = teamMembers.map((member) => member._id)
      query.employeeId = { $in: [...teamMemberIds, req.user._id] }
    } else {
      query.companyId = req.user.companyId
    }

    // Apply filters
    if (status) query.status = status
    if (category) query.category = category
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const expenses = await Expense.find(query)
      .populate("employeeId", "name email")
      .populate("approvals.approverId", "name email")
      .sort({ createdAt: -1 })

    res.json({ expenses })
  } catch (error) {
    console.error("Get expense history error:", error)
    res.status(500).json({ message: "Server error fetching expense history" })
  }
})

// Get single expense
router.get("/:id", authenticate, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("employeeId", "name email")
      .populate("approvals.approverId", "name email")
      .populate("comments.userId", "name")

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    // Check access
    if (req.user.role === "Employee" && expense.employeeId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json({ expense })
  } catch (error) {
    console.error("Get expense error:", error)
    res.status(500).json({ message: "Server error fetching expense" })
  }
})

// Approve expense
router.post("/:id/approve", authenticate, authorize("Manager", "Admin"), async (req, res) => {
  try {
    const { comments } = req.body

    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    // Find approval for current user
    const approvalIndex = expense.approvals.findIndex(
      (approval) => approval.approverId.toString() === req.user._id.toString() && approval.status === "Pending",
    )

    if (approvalIndex === -1 && req.user.role !== "Admin") {
      return res.status(403).json({ message: "You are not authorized to approve this expense" })
    }

    // Admin can override
    if (req.user.role === "Admin") {
      expense.status = "Approved"
      expense.approvals.forEach((approval) => {
        if (approval.status === "Pending") {
          approval.status = "Approved"
          approval.approvedAt = new Date()
        }
      })
    } else {
      // Update approval
      expense.approvals[approvalIndex].status = "Approved"
      expense.approvals[approvalIndex].comments = comments || ""
      expense.approvals[approvalIndex].approvedAt = new Date()

      // Check if all approvals are done
      const allApproved = expense.approvals.every((approval) => approval.status === "Approved")

      if (allApproved) {
        expense.status = "Approved"
      } else {
        expense.currentApprovalLevel += 1
      }
    }

    // Add comment if provided
    if (comments) {
      expense.comments.push({
        userId: req.user._id,
        comment: comments,
      })
    }

    await expense.save()

    res.json({ message: "Expense approved successfully", expense })
  } catch (error) {
    console.error("Approve expense error:", error)
    res.status(500).json({ message: "Server error approving expense" })
  }
})

// Reject expense
router.post("/:id/reject", authenticate, authorize("Manager", "Admin"), async (req, res) => {
  try {
    const { comments } = req.body

    if (!comments) {
      return res.status(400).json({ message: "Comments are required when rejecting" })
    }

    const expense = await Expense.findById(req.params.id)

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    // Find approval for current user
    const approvalIndex = expense.approvals.findIndex(
      (approval) => approval.approverId.toString() === req.user._id.toString() && approval.status === "Pending",
    )

    if (approvalIndex === -1 && req.user.role !== "Admin") {
      return res.status(403).json({ message: "You are not authorized to reject this expense" })
    }

    // Update status
    expense.status = "Rejected"

    if (approvalIndex !== -1) {
      expense.approvals[approvalIndex].status = "Rejected"
      expense.approvals[approvalIndex].comments = comments
      expense.approvals[approvalIndex].approvedAt = new Date()
    }

    // Add comment
    expense.comments.push({
      userId: req.user._id,
      comment: comments,
    })

    await expense.save()

    res.json({ message: "Expense rejected", expense })
  } catch (error) {
    console.error("Reject expense error:", error)
    res.status(500).json({ message: "Server error rejecting expense" })
  }
})

export default router
