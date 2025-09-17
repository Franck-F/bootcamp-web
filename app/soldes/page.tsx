import { ProductCatalog } from "@/components/products/product-catalog"
import { CategoryHero } from "@/components/sections/category-hero"

export default function SoldesPage() {
  return (
    <div className="min-h-screen">
      <CategoryHero
        title="Soldes"
        description="Profitez de nos meilleures offres sur une sélection de sneakers premium."
        image="/placeholder.svg?height=400&width=800"
        category="sale"
        isPromo={true}
      />
      <ProductCatalog defaultCategory="sale" />
    </div>
  )
}
