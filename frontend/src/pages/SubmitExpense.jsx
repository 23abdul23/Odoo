"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import axios from "../api/axios"

export default function SubmitExpense() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    category: "Travel",
    description: "",
    date: new Date().toISOString().split("T")[0],
    receiptUrl: "",
  })

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("/currency/rates/USD")
      const currencyList = Object.keys(response.data.rates).sort()
      setCurrencies(currencyList)
    } catch (err) {
      console.error("Failed to fetch currencies:", err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setOcrLoading(true)
    setError("")

    const formDataUpload = new FormData()
    formDataUpload.append("receipt", file)

    try {
      const response = await axios.post("/ocr/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const { extractedData, receiptUrl } = response.data

      // Auto-fill form with extracted data
      setFormData({
        ...formData,
        amount: extractedData.amount || formData.amount,
        category: extractedData.category || formData.category,
        description: extractedData.description || formData.description,
        date: extractedData.date || formData.date,
        receiptUrl: receiptUrl,
      })

      setSuccess("Receipt processed! Please verify the extracted information.")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process receipt")
    } finally {
      setOcrLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await axios.post("/expenses/create", formData)
      setSuccess("Expense submitted successfully!")
      setTimeout(() => {
        navigate("/my-expenses")
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit expense")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["Travel", "Food", "Accommodation", "Transportation", "Office Supplies", "Entertainment", "Other"]

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Submit Expense</h2>
          <p className="text-gray-600 mt-2">Create a new expense request</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <label htmlFor="receipt" className="cursor-pointer">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm text-gray-600 mb-2">Upload receipt for auto-fill (optional)</p>
                <input
                  type="file"
                  id="receipt"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={ocrLoading}
                />
                <span className="text-primary font-medium hover:underline">
                  {ocrLoading ? "Processing..." : "Choose file"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe the expense..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
