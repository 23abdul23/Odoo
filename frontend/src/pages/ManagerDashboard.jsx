"use client"

import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"

export default function ManagerDashboard() {
  const navigate = useNavigate()

  const menuItems = [
    {
      title: "Pending Approvals",
      description: "Review and approve expense requests",
      icon: "✅",
      path: "/pending-approvals",
      color: "bg-orange-500",
    },
    {
      title: "Team Expenses",
      description: "View your team's expense history",
      icon: "👥",
      path: "/team-expenses",
      color: "bg-purple-500",
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
          <h2 className="text-3xl font-bold text-gray-900">Manager Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage approvals and track team expenses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  )
}
