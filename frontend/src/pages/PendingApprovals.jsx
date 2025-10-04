"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import axios from "../api/axios"

export default function PendingApprovals() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [comments, setComments] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get("/expenses/pending-approvals")
      setExpenses(response.data.expenses)
    } catch (err) {
      console.error("Failed to fetch pending approvals:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (expenseId) => {
    setActionLoading(true)
    try {
      await axios.post(`/expenses/${expenseId}/approve`, { comments })
      setComments("")
      setSelectedExpense(null)
      fetchPendingApprovals()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve expense")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (expenseId) => {
    if (!comments.trim()) {
      alert("Comments are required when rejecting")
      return
    }

    setActionLoading(true)
    try {
      await axios.post(`/expenses/${expenseId}/reject`, { comments })
      setComments("")
      setSelectedExpense(null)
      fetchPendingApprovals()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject expense")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Pending Approvals</h2>
          <p className="text-gray-600 mt-2">Review and approve expense requests</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading approvals...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted by: {expense.employeeId.name} ({expense.employeeId.email})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {expense.amount} {expense.currency}
                    </p>
                    <p className="text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{expense.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">{expense.status}</p>
                  </div>
                </div>

                {selectedExpense === expense._id ? (
                  <div className="mt-4 space-y-4">
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add comments (optional for approval, required for rejection)"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(expense._id)}
                        disabled={actionLoading}
                        className="flex-1 py-2 px-4 bg-success text-white font-medium rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(expense._id)}
                        disabled={actionLoading}
                        className="flex-1 py-2 px-4 bg-danger text-white font-medium rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setSelectedExpense(null)
                          setComments("")
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedExpense(expense._id)}
                    className="w-full py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition"
                  >
                    Review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
