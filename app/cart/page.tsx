import { CartPage } from "@/components/cart/cart-page"
import { Footer } from "@/components/layout/footer"

export default function Cart() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <CartPage />
      </main>
      <Footer />
    </div>
  )
}
