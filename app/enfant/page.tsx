import { ProductCatalog } from "@/components/products/product-catalog"
import { CategoryHero } from "@/components/sections/category-hero"

export default function EnfantPage() {
  return (
    <div className="min-h-screen">
      <CategoryHero
        title="Collection Enfant"
        description="Des sneakers colorées et durables pour accompagner les aventures de vos enfants."
        image="/placeholder.svg?height=400&width=800"
        category="kids"
      />
      <ProductCatalog defaultCategory="kids" />
    </div>
  )
}
