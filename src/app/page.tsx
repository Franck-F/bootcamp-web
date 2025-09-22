import { Navigation } from '@/components/navigation'
import { HeroSectionNew } from '@/components/hero-section-new'
import { FeaturedProductsNew } from '@/components/featured-products-new'
import { CategoriesSectionNew } from '@/components/categories-section-new'
import { NewsletterSectionNew } from '@/components/newsletter-section-new'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main>
        <HeroSectionNew />
        <FeaturedProductsNew />
        <CategoriesSectionNew />
        <NewsletterSectionNew />
      </main>
      <Footer />
    </div>
  )
}
