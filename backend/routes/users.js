import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// Create new user (Admin only)
router.post("/create", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "Employee",
      managerId: managerId || null,
      companyId: req.user.companyId,
    })

    await user.save()

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
      },
    })
  } catch (error) {
    console.error("Create user error:", error)
    res.status(500).json({ message: "Server error creating user" })
  }
})

// Get all users in company (Admin and Manager)
router.get("/", authenticate, authorize("Admin", "Manager"), async (req, res) => {
  try {
    const users = await User.find({ companyId: req.user.companyId })
      .select("-password")
      .populate("managerId", "name email")

    res.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error fetching users" })
  }
})

// Get user by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })
      .select("-password")
      .populate("managerId", "name email")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error fetching user" })
  }
})

// Update user role (Admin only)
router.put("/:id/update-role", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const { role } = req.body

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { role },
      { new: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User role updated successfully", user })
  } catch (error) {
    console.error("Update role error:", error)
    res.status(500).json({ message: "Server error updating role" })
  }
})

// Assign manager to user (Admin only)
router.put("/:id/manager", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const { managerId } = req.body

    // Verify manager exists and is in same company
    if (managerId) {
      const manager = await User.findOne({
        _id: managerId,
        companyId: req.user.companyId,
        role: { $in: ["Manager", "Admin"] },
      })

      if (!manager) {
        return res.status(400).json({ message: "Invalid manager" })
      }
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { managerId: managerId || null },
      { new: true },
    )
      .select("-password")
      .populate("managerId", "name email")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "Manager assigned successfully", user })
  } catch (error) {
    console.error("Assign manager error:", error)
    res.status(500).json({ message: "Server error assigning manager" })
  }
})

// Get team members (Manager)
router.get("/team/members", authenticate, authorize("Manager", "Admin"), async (req, res) => {
  try {
    const teamMembers = await User.find({
      managerId: req.user._id,
      companyId: req.user.companyId,
    }).select("-password")

    res.json({ teamMembers })
  } catch (error) {
    console.error("Get team members error:", error)
    res.status(500).json({ message: "Server error fetching team members" })
  }
})

export default router
