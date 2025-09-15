"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { SearchDialog } from "@/components/search/search-dialog"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  const handleMobileSearchClick = () => {
    setIsMenuOpen(false)
    router.push("/search")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl">SneakPeak</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Produits
            </Link>
            <Link href="/homme" className="text-sm font-medium hover:text-primary transition-colors">
              Homme
            </Link>
            <Link href="/femme" className="text-sm font-medium hover:text-primary transition-colors">
              Femme
            </Link>
            <Link href="/enfant" className="text-sm font-medium hover:text-primary transition-colors">
              Enfant
            </Link>
            <Link href="/nouveautes" className="text-sm font-medium hover:text-primary transition-colors">
              Nouveautés
            </Link>
            <Link href="/soldes" className="text-sm font-medium hover:text-primary transition-colors text-destructive">
              Soldes
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={handleSearchClick}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Rechercher</span>
            </Button>

            <ThemeToggle />

            <CartDrawer />

            <UserMenu />

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                Produits
              </Link>
              <Link href="/homme" className="text-sm font-medium hover:text-primary transition-colors">
                Homme
              </Link>
              <Link href="/femme" className="text-sm font-medium hover:text-primary transition-colors">
                Femme
              </Link>
              <Link href="/enfant" className="text-sm font-medium hover:text-primary transition-colors">
                Enfant
              </Link>
              <Link href="/nouveautes" className="text-sm font-medium hover:text-primary transition-colors">
                Nouveautés
              </Link>
              <Link
                href="/soldes"
                className="text-sm font-medium hover:text-primary transition-colors text-destructive"
              >
                Soldes
              </Link>
              <div className="pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleMobileSearchClick}>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  )
}
