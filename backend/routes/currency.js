import express from "express"
import axios from "axios"

const router = express.Router()

// Get all countries with currencies
router.get("/countries", async (req, res) => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,currencies")
    const countries = response.data.map((country) => {
      const currencies = country.currencies ? Object.keys(country.currencies) : []
      return {
        name: country.name.common,
        currency: currencies[0] || "USD",
      }
    })

    res.json({ countries: countries.sort((a, b) => a.name.localeCompare(b.name)) })
  } catch (error) {
    console.error("Get countries error:", error)
    res.status(500).json({ message: "Server error fetching countries" })
  }
})

// Get exchange rates
router.get("/rates/:baseCurrency", async (req, res) => {
  try {
    const { baseCurrency } = req.params
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)

    res.json({
      base: response.data.base,
      rates: response.data.rates,
      date: response.data.date,
    })
  } catch (error) {
    console.error("Get exchange rates error:", error)
    res.status(500).json({ message: "Server error fetching exchange rates" })
  }
})

// Convert currency
router.post("/convert", async (req, res) => {
  try {
    const { amount, from, to } = req.body

    if (from === to) {
      return res.json({ convertedAmount: amount })
    }

    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`)
    const rate = response.data.rates[to]
    const convertedAmount = amount * rate

    res.json({
      amount,
      from,
      to,
      rate,
      convertedAmount,
    })
  } catch (error) {
    console.error("Convert currency error:", error)
    res.status(500).json({ message: "Server error converting currency" })
  }
})

export default router
