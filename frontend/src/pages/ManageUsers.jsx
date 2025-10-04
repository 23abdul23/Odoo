"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import axios from "../api/axios"

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [roleTargetUser, setRoleTargetUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState("Employee")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    managerId: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users")
      setUsers(response.data.users)
    } catch (err) {
      console.error("Failed to fetch users:", err)
    } finally {
      setLoading(false)
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
    try {
      await axios.post("/users/create", formData)
      setShowModal(false)
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "Employee",
        managerId: "",
      })
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user")
    }
  }

  const managers = users.filter((u) => u.role === "Manager" || u.role === "Admin")

  // Role-based color classes for the role dropdown (filled colors)
  const roleClasses = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-600 text-white"
      case "Manager":
        return "bg-yellow-500 text-black"
      default:
        return "bg-blue-600 text-white" // Employee
    }
  }

  // Outside click to close any open 3-dot menu
  useEffect(() => {
    const onClick = () => setOpenMenuId(null)
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  const openModifyRole = (user) => {
    setRoleTargetUser(user)
    setSelectedRole(user.role || "Employee")
    setShowRoleModal(true)
    setOpenMenuId(null)
  }

  const confirmModifyRole = () => {
    if (!roleTargetUser) return
    setUsers((prev) => prev.map((u) => (u._id === roleTargetUser._id ? { ...u, role: selectedRole } : u)))
    setShowRoleModal(false)
    setRoleTargetUser(null)
  }

  const deleteUserLocal = (user) => {
    if (window.confirm(`Delete user ${user.name}? This is a frontend-only action.`)) {
      setUsers((prev) => prev.filter((u) => u._id !== user._id))
    }
    setOpenMenuId(null)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Manage Users</h2>
            <p className="text-gray-600 mt-2">Create and manage user accounts</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition"
          >
            Add User
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${roleClasses(
                          user.role,
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.managerId ? user.managerId.name : "None"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                      <button
                        type="button"
                        aria-label="More options"
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          const rect = e.currentTarget.getBoundingClientRect()
                          setMenuPosition({
                            top: rect.bottom + window.scrollY,
                            right: window.innerWidth - rect.right
                          })
                          setOpenMenuId((prev) => (prev === user._id ? null : user._id))
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 text-gray-700"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Manager (Optional)</label>
                  <select
                    name="managerId"
                    value={formData.managerId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">No Manager</option>
                    {managers.map((manager) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Overlay menu positioned absolutely outside table */}
        {openMenuId && (
          <div
            className="fixed w-52 bg-white border-0 rounded-lg shadow-xl ring-1 ring-gray-200 z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: '#ffffff',
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`
            }}
          >
            <div className="py-2">
              <button
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3"
                onClick={() => {
                  const user = users.find(u => u._id === openMenuId)
                  if (user) openModifyRole(user)
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Modify role
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-3"
                onClick={() => {
                  const user = users.find(u => u._id === openMenuId)
                  if (user) deleteUserLocal(user)
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete user
              </button>
            </div>
          </div>
        )}

        {showRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Modify role</h4>
              <div className="space-y-2">
                {[
                  { value: "Employee", label: "Employee" },
                  { value: "Manager", label: "Manager" },
                  { value: "Admin", label: "Admin" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="roleSelect"
                      value={opt.value}
                      checked={selectedRole === opt.value}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    />
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleClasses(opt.value)}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => {
                    setShowRoleModal(false)
                    setRoleTargetUser(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={confirmModifyRole}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
