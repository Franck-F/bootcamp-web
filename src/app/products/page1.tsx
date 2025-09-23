import { Suspense } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ProductsPageContent } from '@/components/products-page-content'

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Chargement des produits...</p>
          </div>
        </div>
      }>
        <ProductsPageContent />
      </Suspense>
      
      <Footer />
    </div>
  )
}