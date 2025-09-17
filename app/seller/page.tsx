import { ProtectedRoute } from "@/components/auth/protected-route"
import { SellerDashboard } from "@/components/seller/seller-dashboard"

export default function SellerPage() {
  return (
    <ProtectedRoute requiredRole="seller">
      <SellerDashboard />
    </ProtectedRoute>
  )
}
