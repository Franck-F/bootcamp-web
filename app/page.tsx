import { Hero } from "@/components/sections/hero"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { Categories } from "@/components/sections/categories"
import { Newsletter } from "@/components/sections/newsletter"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Newsletter />
    </main>
  )
}
