"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice"
import axios from "../api/axios"

export default function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [countries, setCountries] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    try {
      const response = await axios.get("/currency/countries")
      setCountries(response.data.countries)
    } catch (err) {
      console.error("Failed to fetch countries:", err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    dispatch(loginStart())

    try {
      const response = await axios.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        country: formData.country,
      })
      dispatch(loginSuccess(response.data))
      navigate("/")
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed"
      setError(message)
      dispatch(loginFailure(message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left side - Project Info */}
      <div className="w-2/3 flex items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Expense Manager</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Join thousands of companies who trust our platform to streamline their expense management processes.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Multi-Currency Support</h3>
                <p className="text-gray-600">Handle expenses in multiple currencies with real-time exchange rates and automatic conversion.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.018.118l-3.7-2.87a.75.75 0 00-.916 0L8 11.464" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">OCR Receipt Scanning</h3>
                <p className="text-gray-600">Upload receipts and let our AI extract data automatically for faster expense submission.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Team Management</h3>
                <p className="text-gray-600">Organize teams with role-based access and customizable approval hierarchies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Signup Form */}
      <div className="w-1/3 bg-white shadow-2xl flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
            <p className="text-gray-600 mt-2">Create your account today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name} ({country.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
