import express from "express"
import axios from "axios"
import fs from 'fs'

import country from '../countries_currency.json' with { type : 'json'} 


const router = express.Router()

// Get all countries with currencies
router.get("/countries", async (req, res) => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies")

    console.log(response.data)
    const countries = response.data.map((country) => {
      const currencies = country.currencies ? Object.keys(country.currencies) : []
      return {
        name: country.name.common,
        currency: currencies[0] || "USD",
      }
    })

    res.json({ countries: countries.sort((a, b) => a.name.localeCompare(b.name)) })
  } catch (error) {

    console.log("Using the Fallback")
    const countries = country.map((country) => {
      const currencies = country.currencies ? Object.keys(country.currencies) : []
      return {
        name: country.name.common,
        currency: currencies[0] || "USD",
      }
    })

    res.json({ countries: countries.sort((a, b) => a.name.localeCompare(b.name)) })
  }
})

// Get exchange rates
router.get("/rates/:baseCurrency", async (req, res) => {
  try {
    const { baseCurrency } = req.params
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
    const data = await response.json()


    res.json({
      base: data.base,
      rates: data.rates,
      date: data.date,
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
