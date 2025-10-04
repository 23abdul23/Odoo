"use client"

import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"

export default function AdminDashboard() {
  const navigate = useNavigate()

  const menuItems = [
    {
      title: "Manage Users",
      description: "Create and manage user accounts",
      icon: "👤",
      path: "/manage-users",
      color: "bg-indigo-500",
    },
    {
      title: "Approval Rules",
      description: "Configure approval workflows",
      icon: "⚙️",
      path: "/approval-rules",
      color: "bg-pink-500",
    },
    {
      title: "All Expenses",
      description: "View all company expenses",
      icon: "💰",
      path: "/all-expenses",
      color: "bg-teal-500",
    },
    {
      title: "Pending Approvals",
      description: "Review pending expense requests",
      icon: "✅",
      path: "/pending-approvals",
      color: "bg-orange-500",
    },
    {
      title: "Submit Expense",
      description: "Create a new expense request",
      icon: "📝",
      path: "/submit-expense",
      color: "bg-blue-500",
    },
    {
      title: "My Expenses",
      description: "View your expense submissions",
      icon: "📊",
      path: "/my-expenses",
      color: "bg-green-500",
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Complete control over the expense management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`${item.color} text-white text-3xl p-3 rounded-lg`}>{item.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  )
}
