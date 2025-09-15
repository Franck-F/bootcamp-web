import { ProductCatalog } from "@/components/products/product-catalog"
import { CategoryHero } from "@/components/sections/category-hero"

export default function NouveautesPage() {
  return (
    <div className="min-h-screen">
      <CategoryHero
        title="Nouveautés"
        description="Découvrez les dernières sorties et les modèles les plus récents de notre collection."
        image="/placeholder.svg?height=400&width=800"
        category="new"
      />
      <ProductCatalog defaultCategory="new" />
    </div>
  )
}
