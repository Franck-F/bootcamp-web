import { ProtectedRoute } from "@/components/auth/protected-route"
import { StockManagement } from "@/components/products/stock-management"
import { Header } from "@/components/layout/header"

export default function SellerProductsPage() {
  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <StockManagement />
        </main>
      </div>
    </ProtectedRoute>
  )
}
