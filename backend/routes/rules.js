import express from "express"
import ApprovalRule from "../models/ApprovalRule.js"
import User from "../models/User.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// Create approval rule (Admin only)
router.post("/create", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const { name, type, sequence, percentage, specificApproverId, minAmount, maxAmount, categories } = req.body

    // Validate based on type
    if (type === "Sequential" || type === "Hybrid") {
      if (!sequence || sequence.length === 0) {
        return res.status(400).json({ message: "Sequence is required for Sequential/Hybrid rules" })
      }
    }

    if (type === "Percentage") {
      if (percentage === undefined || percentage < 0 || percentage > 100) {
        return res.status(400).json({ message: "Valid percentage (0-100) is required" })
      }
    }

    if (type === "SpecificApprover") {
      if (!specificApproverId) {
        return res.status(400).json({ message: "Specific approver is required" })
      }

      // Verify approver exists
      const approver = await User.findOne({
        _id: specificApproverId,
        companyId: req.user.companyId,
        role: { $in: ["Manager", "Admin"] },
      })

      if (!approver) {
        return res.status(400).json({ message: "Invalid approver" })
      }
    }

    const rule = new ApprovalRule({
      companyId: req.user.companyId,
      name,
      type,
      sequence: sequence || [],
      percentage: percentage || 0,
      specificApproverId: specificApproverId || null,
      minAmount: minAmount || 0,
      maxAmount: maxAmount || null,
      categories: categories || [],
      isActive: true,
    })

    await rule.save()

    res.status(201).json({
      message: "Approval rule created successfully",
      rule,
    })
  } catch (error) {
    console.error("Create rule error:", error)
    res.status(500).json({ message: "Server error creating rule" })
  }
})

// Get all rules (Admin)
router.get("/", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const rules = await ApprovalRule.find({ companyId: req.user.companyId })
      .populate("specificApproverId", "name email")
      .populate("sequence.approverId", "name email")
      .sort({ createdAt: -1 })

    res.json({ rules })
  } catch (error) {
    console.error("Get rules error:", error)
    res.status(500).json({ message: "Server error fetching rules" })
  }
})

// Get single rule
router.get("/:id", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const rule = await ApprovalRule.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })
      .populate("specificApproverId", "name email")
      .populate("sequence.approverId", "name email")

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" })
    }

    res.json({ rule })
  } catch (error) {
    console.error("Get rule error:", error)
    res.status(500).json({ message: "Server error fetching rule" })
  }
})

// Update rule (Admin only)
router.put("/:id", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const { name, type, sequence, percentage, specificApproverId, minAmount, maxAmount, categories, isActive } =
      req.body

    const rule = await ApprovalRule.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" })
    }

    // Update fields
    if (name !== undefined) rule.name = name
    if (type !== undefined) rule.type = type
    if (sequence !== undefined) rule.sequence = sequence
    if (percentage !== undefined) rule.percentage = percentage
    if (specificApproverId !== undefined) rule.specificApproverId = specificApproverId
    if (minAmount !== undefined) rule.minAmount = minAmount
    if (maxAmount !== undefined) rule.maxAmount = maxAmount
    if (categories !== undefined) rule.categories = categories
    if (isActive !== undefined) rule.isActive = isActive

    await rule.save()

    res.json({
      message: "Rule updated successfully",
      rule,
    })
  } catch (error) {
    console.error("Update rule error:", error)
    res.status(500).json({ message: "Server error updating rule" })
  }
})

// Delete rule (Admin only)
router.delete("/:id", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const rule = await ApprovalRule.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    })

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" })
    }

    res.json({ message: "Rule deleted successfully" })
  } catch (error) {
    console.error("Delete rule error:", error)
    res.status(500).json({ message: "Server error deleting rule" })
  }
})

// Toggle rule active status (Admin only)
router.patch("/:id/toggle", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const rule = await ApprovalRule.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" })
    }

    rule.isActive = !rule.isActive
    await rule.save()

    res.json({
      message: `Rule ${rule.isActive ? "activated" : "deactivated"} successfully`,
      rule,
    })
  } catch (error) {
    console.error("Toggle rule error:", error)
    res.status(500).json({ message: "Server error toggling rule" })
  }
})

export default router
