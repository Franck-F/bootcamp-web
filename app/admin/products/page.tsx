import { ProtectedRoute } from "@/components/auth/protected-route"
import { StockManagement } from "@/components/products/stock-management"

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <main>
          <StockManagement />
        </main>
      </div>
    </ProtectedRoute>
  )
}
