import { CheckoutPage } from "@/components/checkout/checkout-page"
import { Footer } from "@/components/layout/footer"

export default function Checkout() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <CheckoutPage />
      </main>
      <Footer />
    </div>
  )
}
