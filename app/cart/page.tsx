import { CartPage } from "@/components/cart/cart-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function Cart() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CartPage />
      </main>
      <Footer />
    </div>
  )
}
