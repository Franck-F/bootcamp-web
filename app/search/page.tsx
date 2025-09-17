"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCatalog } from "@/components/products/product-catalog"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || "all"

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{query ? `Résultats pour "${query}"` : "Recherche"}</h1>
          <p className="text-muted-foreground">
            {query
              ? "Découvrez tous les produits correspondant à votre recherche"
              : "Recherchez parmi notre collection de sneakers"}
          </p>
        </div>

        <ProductCatalog defaultSearch={query} defaultCategory={category} />
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
