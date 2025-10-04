"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import axios from "../api/axios"

export default function ApprovalRules() {
  const [rules, setRules] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "Sequential",
    minAmount: 0,
    maxAmount: "",
    categories: [],
  })

  useEffect(() => {
    fetchRules()
    fetchUsers()
  }, [])

  const fetchRules = async () => {
    try {
      const response = await axios.get("/rules")
      setRules(response.data.rules)
    } catch (err) {
      console.error("Failed to fetch rules:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users")
      setUsers(response.data.users.filter((u) => u.role === "Manager" || u.role === "Admin"))
    } catch (err) {
      console.error("Failed to fetch users:", err)
    }
  }

  const handleToggle = async (ruleId) => {
    try {
      await axios.patch(`/rules/${ruleId}/toggle`)
      fetchRules()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle rule")
    }
  }

  const handleDelete = async (ruleId) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        await axios.delete(`/rules/${ruleId}`)
        fetchRules()
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete rule")
      }
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Approval Rules</h2>
            <p className="text-gray-600 mt-2">Configure approval workflows</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition"
          >
            Create Rule
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading rules...</p>
          </div>
        ) : rules.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No approval rules configured</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Type: {rule.type}</p>
                    <p className="text-sm text-gray-600">
                      Amount Range: {rule.minAmount} - {rule.maxAmount || "∞"}
                    </p>
                    {rule.categories.length > 0 && (
                      <p className="text-sm text-gray-600">Categories: {rule.categories.join(", ")}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(rule._id)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        rule.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {rule.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Approval Rule</h3>
              <p className="text-sm text-gray-600 mb-4">
                Note: This is a simplified form. For complex rules, use the API directly.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
