"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/components/auth/auth-provider"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { SellerDashboard } from "@/components/seller/seller-dashboard"
import { CustomerDashboard } from "@/components/customer/customer-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "seller" && <SellerDashboard />}
      {user?.role === "customer" && <CustomerDashboard />}
    </ProtectedRoute>
  )
}
