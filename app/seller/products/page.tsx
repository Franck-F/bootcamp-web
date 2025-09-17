import { ProtectedRoute } from "@/components/auth/protected-route"
import { StockManagement } from "@/components/products/stock-management"

export default function SellerProductsPage() {
  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-background">
        <main>
          <StockManagement />
        </main>
      </div>
    </ProtectedRoute>
  )
}
