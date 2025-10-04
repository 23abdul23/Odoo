import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import EmployeeDashboard from "./pages/EmployeeDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import SubmitExpense from "./pages/SubmitExpense"
import MyExpenses from "./pages/MyExpenses"
import PendingApprovals from "./pages/PendingApprovals"
import TeamExpenses from "./pages/TeamExpenses"
import ManageUsers from "./pages/ManageUsers"
import ApprovalRules from "./pages/ApprovalRules"
import AllExpenses from "./pages/AllExpenses"

function App() {
  const { user, token } = useSelector((state) => state.auth)

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!token) {
      return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/" replace />
    }

    return children
  }

  const getDashboard = () => {
    if (!user) return <Navigate to="/login" replace />

    switch (user.role) {
      case "Admin":
        return <AdminDashboard />
      case "Manager":
        return <ManagerDashboard />
      case "Employee":
        return <EmployeeDashboard />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/" replace /> : <Signup />} />

        <Route path="/" element={<ProtectedRoute>{getDashboard()}</ProtectedRoute>} />

        <Route
          path="/submit-expense"
          element={
            <ProtectedRoute>
              <SubmitExpense />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-expenses"
          element={
            <ProtectedRoute>
              <MyExpenses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending-approvals"
          element={
            <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
              <PendingApprovals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team-expenses"
          element={
            <ProtectedRoute allowedRoles={["Manager", "Admin"]}>
              <TeamExpenses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/approval-rules"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ApprovalRules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-expenses"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AllExpenses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
