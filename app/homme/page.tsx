import { ProductCatalog } from "@/components/products/product-catalog"
import { CategoryHero } from "@/components/sections/category-hero"

export default function HommePage() {
  return (
    <div className="min-h-screen">
      <CategoryHero
        title="Collection Homme"
        description="Découvrez notre sélection de sneakers pour homme, alliant style urbain et performance."
        image="/placeholder.svg?height=400&width=800"
        category="men"
      />
      <ProductCatalog defaultCategory="men" />
    </div>
  )
}
