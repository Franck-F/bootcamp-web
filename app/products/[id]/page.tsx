import { ProductDetail } from "@/components/products/product-detail"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { mockProducts } from "@/lib/mock-data"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}
