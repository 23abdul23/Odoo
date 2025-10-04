import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import Company from "../models/Company.js"
import { log } from "console"

const router = express.Router()

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, country } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Fetch country currency
    const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${country}?fields=name,currencies`)
    const countryData = await countryResponse.json()

    let currency = "USD"
    if (countryData && countryData[0] && countryData[0].currencies) {
      const currencies = Object.keys(countryData[0].currencies)
      currency = currencies[0] || "USD"
    }

    // Create company
    const company = new Company({
      name: `${name}'s Company`,
      country: country,
      currency: currency,
    })
    await company.save()

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user as Admin
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      companyId: company._id,
    })
    await user.save()

    // Generate token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: "Server error during signup" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        managerId: user.managerId,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

export default router
