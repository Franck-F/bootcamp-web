import { CheckoutPage } from "@/components/checkout/checkout-page"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function Checkout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CheckoutPage />
      </main>
      <Footer />
    </div>
  )
}
