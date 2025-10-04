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
    percentage: 50,
    specificApproverId: "",
    sequence: [],
  })
  const [categoryInput, setCategoryInput] = useState("")
  const [formError, setFormError] = useState("")

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryInput.trim()],
      }))
      setCategoryInput("")
    }
  }

  const handleRemoveCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }))
  }

  const handleAddApprover = () => {
    if (formData.specificApproverId && !formData.sequence.some((s) => s.approverId === formData.specificApproverId)) {
      const selectedUser = users.find((u) => u._id === formData.specificApproverId)
      setFormData((prev) => ({
        ...prev,
        sequence: [
          ...prev.sequence,
          {
            order: prev.sequence.length + 1,
            approverId: formData.specificApproverId,
            name: selectedUser?.name || "Unknown",
          },
        ],
        specificApproverId: "",
      }))
    }
  }

  const handleRemoveApprover = (approverId) => {
    setFormData((prev) => ({
      ...prev,
      sequence: prev.sequence.filter((s) => s.approverId !== approverId).map((s, index) => ({ ...s, order: index + 1 })),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        minAmount: Number(formData.minAmount),
        maxAmount: formData.maxAmount ? Number(formData.maxAmount) : null,
        categories: formData.categories,
      }

      if (formData.type === "Sequential" || formData.type === "Hybrid") {
        if (formData.sequence.length === 0) {
          setFormError("Please add at least one approver for Sequential/Hybrid rules")
          return
        }
        payload.sequence = formData.sequence.map((s) => ({
          order: s.order,
          approverId: s.approverId,
        }))
      }

      if (formData.type === "Percentage") {
        payload.percentage = Number(formData.percentage)
      }

      if (formData.type === "SpecificApprover") {
        if (!formData.specificApproverId) {
          setFormError("Please select a specific approver")
          return
        }
        payload.specificApproverId = formData.specificApproverId
      }

      await axios.post("/rules/create", payload)
      setShowModal(false)
      setFormData({
        name: "",
        type: "Sequential",
        minAmount: 0,
        maxAmount: "",
        categories: [],
        percentage: 50,
        specificApproverId: "",
        sequence: [],
      })
      fetchRules()
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create rule")
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Approval Rule</h3>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rule Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., High Value Expense Approval"
                  />
                </div>

                {/* Rule Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approval Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Sequential">Sequential (One by one approval)</option>
                    <option value="Percentage">Percentage (X% must approve)</option>
                    <option value="SpecificApprover">Specific Approver</option>
                    <option value="Hybrid">Hybrid (Combination)</option>
                  </select>
                </div>

                {/* Amount Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount *</label>
                    <input
                      type="number"
                      name="minAmount"
                      value={formData.minAmount}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Amount (leave empty for unlimited)
                    </label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={formData.maxAmount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories (optional, leave empty for all)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Travel, Office Supplies"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Add
                    </button>
                  </div>
                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                        >
                          {category}
                          <button type="button" onClick={() => handleRemoveCategory(category)} className="font-bold">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Percentage Field */}
                {formData.type === "Percentage" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Approval Percentage *
                    </label>
                    <input
                      type="number"
                      name="percentage"
                      value={formData.percentage}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter a value between 1-100</p>
                  </div>
                )}

                {/* Specific Approver */}
                {formData.type === "SpecificApprover" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Approver *</label>
                    <select
                      name="specificApproverId"
                      value={formData.specificApproverId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Select an approver --</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sequential/Hybrid Approver Sequence */}
                {(formData.type === "Sequential" || formData.type === "Hybrid") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Approval Sequence *</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.specificApproverId}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, specificApproverId: e.target.value }))
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select an approver --</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.email}) - {user.role}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddApprover}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Add
                      </button>
                    </div>
                    {formData.sequence.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {formData.sequence.map((approver) => (
                          <div
                            key={approver.approverId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm">
                              {approver.order}. {approver.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveApprover(approver.approverId)}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setFormError("")
                    }}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
