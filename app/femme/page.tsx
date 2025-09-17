import { ProductCatalog } from "@/components/products/product-catalog"
import { CategoryHero } from "@/components/sections/category-hero"

export default function FemmePage() {
  return (
    <div className="min-h-screen">
      <CategoryHero
        title="Collection Femme"
        description="Élégance et confort se rencontrent dans notre collection féminine de sneakers premium."
        image="/placeholder.svg?height=400&width=800"
        category="women"
      />
      <ProductCatalog defaultCategory="women" />
    </div>
  )
}
