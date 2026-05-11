import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// ==========================
// AUTH PAGES
// ==========================
import Login from "../pages/auth/Login";
import Unauthorized from "../pages/auth/Unauthorized";

// ==========================
// MAIN MODULES
// ==========================
import Dashboard from "../pages/dashboard/Dashboard";
import Customers from "../pages/customers/Customers";
import Orders from "../pages/orders/Orders";
import DirectSales from "../pages/sales/DirectSales";
import Transactions from "../pages/transactions/Transactions";
import Reports from "../pages/reports/Reports";
import SMS from "../pages/notifications/SMS";

// ==========================
// CREATE PAGES
// ==========================
import CreateCustomer from "../pages/customers/CreateCustomer";
import CreateOrder from "../pages/orders/CreateOrder";
import CreateTransaction from "../pages/transactions/CreateTransaction";

// ==========================
// 🛡️ ADMIN APPROVAL SYSTEM
// ==========================
import ApprovalDashboard from "../pages/admin/ApprovalDashboard";
import PendingOrders from "../pages/admin/PendingOrders";
import PendingPayments from "../pages/admin/PendingPayments";

// ==========================
// 👤 ADMIN USER MANAGEMENT PANEL (NEW)
// ==========================
import Users from "../pages/admin/Users";

// ==========================
// PROTECTED ROUTE WRAPPER
// ==========================
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {

  return (
    <Routes>

      {/* ==========================
          PUBLIC ROUTES
      ========================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ==========================
          MAIN APP (PROTECTED)
      ========================== */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >

        {/* ==========================
            DASHBOARD
        ========================== */}
        <Route index element={<Dashboard />} />

        {/* ==========================
            CORE ERP MODULES
        ========================== */}
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="sales" element={<DirectSales />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<SMS />} />

        {/* ==========================
            CREATE PAGES (STAFF + ADMIN)
        ========================== */}
        <Route
          path="customers/create"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <CreateCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders/create"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <CreateOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="transactions/create"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <CreateTransaction />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            🛡️ ADMIN APPROVAL SYSTEM
        ========================== */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ApprovalDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/pending-orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/pending-payments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PendingPayments />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            👤 USER MANAGEMENT (NEW ADMIN PANEL)
        ========================== */}
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ==========================
          CATCH ALL ROUTE
      ========================== */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}