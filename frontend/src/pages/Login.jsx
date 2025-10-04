"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice"
import axios from "../api/axios"

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    dispatch(loginStart())

    try {
      const response = await axios.post("/auth/login", formData)
      dispatch(loginSuccess(response.data))
      navigate("/")
    } catch (err) {
      const message = err.response?.data?.message || "Login failed"
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
              Streamline your expense management with our comprehensive solution. Track, approve, and manage expenses effortlessly.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Easy Expense Tracking</h3>
                <p className="text-gray-600">Submit and track expenses with OCR receipt scanning and automatic categorization.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0h.5a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0117 4h-8.5A1.5 1.5 0 007 5.5v4A1.5 1.5 0 008.5 11h.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Approval Workflow</h3>
                <p className="text-gray-600">Configurable approval rules with multi-level authorization and automated notifications.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-1/3 bg-white shadow-2xl flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
