import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import expenseRoutes from "./routes/expenses.js"
import ruleRoutes from "./routes/rules.js"
import ocrRoutes from "./routes/ocr.js"
import currencyRoutes from "./routes/currency.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/expenses", expenseRoutes)
app.use("/rules", ruleRoutes)
app.use("/ocr", ocrRoutes)
app.use("/currency", currencyRoutes)

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Expense Management API is running" })
})

// MongoDB Connection
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/expense-management"

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })
