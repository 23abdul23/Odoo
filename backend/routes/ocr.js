import express from "express"
import multer from "multer"
import Tesseract from "tesseract.js"
import { authenticate } from "../middleware/auth.js"
import path from "path"
import fs from "fs"

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files (JPEG, PNG) and PDFs are allowed"))
    }
  },
})

// Helper function to extract expense data from text
function extractExpenseData(text) {
  const data = {
    amount: null,
    date: null,
    category: "Other",
    description: "",
  }

  // Extract amount (look for currency symbols and numbers)
  const amountRegex = /(?:USD|EUR|GBP|\$|€|£)\s*(\d+(?:\.\d{2})?)|(\d+(?:\.\d{2})?)\s*(?:USD|EUR|GBP|\$|€|£)/gi
  const amountMatch = text.match(amountRegex)
  if (amountMatch) {
    const numMatch = amountMatch[0].match(/\d+(?:\.\d{2})?/)
    if (numMatch) {
      data.amount = Number.parseFloat(numMatch[0])
    }
  }

  // Extract date
  const dateRegex = /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}/g
  const dateMatch = text.match(dateRegex)
  if (dateMatch) {
    data.date = dateMatch[0]
  }

  // Detect category based on keywords
  const lowerText = text.toLowerCase()
  if (lowerText.includes("hotel") || lowerText.includes("accommodation")) {
    data.category = "Accommodation"
  } else if (lowerText.includes("restaurant") || lowerText.includes("food") || lowerText.includes("meal")) {
    data.category = "Food"
  } else if (lowerText.includes("taxi") || lowerText.includes("uber") || lowerText.includes("transport")) {
    data.category = "Transportation"
  } else if (lowerText.includes("flight") || lowerText.includes("airline") || lowerText.includes("train")) {
    data.category = "Travel"
  } else if (lowerText.includes("office") || lowerText.includes("supplies") || lowerText.includes("stationery")) {
    data.category = "Office Supplies"
  }

  // Use first line as description
  const lines = text.split("\n").filter((line) => line.trim().length > 0)
  if (lines.length > 0) {
    data.description = lines[0].substring(0, 100)
  }

  return data
}

// Upload and process receipt
router.post("/upload", authenticate, upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const filePath = req.file.path

    // Process image with Tesseract
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    })

    // Extract expense data from OCR text
    const expenseData = extractExpenseData(text)

    // Return the file URL and extracted data
    res.json({
      message: "Receipt processed successfully",
      receiptUrl: `/uploads/${req.file.filename}`,
      extractedData: expenseData,
      rawText: text,
    })
  } catch (error) {
    console.error("OCR processing error:", error)
    res.status(500).json({ message: "Error processing receipt" })
  }
})

export default router
