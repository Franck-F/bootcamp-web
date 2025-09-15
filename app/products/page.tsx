import { ProductCatalog } from "@/components/products/product-catalog"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
       
      <main>
        <ProductCatalog />
      </main>
      <Footer />
    </div>
  )
}
