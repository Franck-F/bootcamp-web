'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/store/cart-context'
import { useWishlist } from '@/store/wishlist-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CartSidebar } from '@/components/cart-sidebar'
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Heart,
  Package,
  Settings,
  LogOut
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBar } from '@/components/search-bar'
import { usePathname } from 'next/navigation' // ✅ Import bien placé

export function Navigation() {
  const { user, signOut } = useAuth()
  const { getTotalItems, toggleCart } = useCart()
  const { getWishlistCount } = useWishlist()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname() // ✅ Hook bien placé

  const handleSignOut = () => {
    signOut()
  }

  const isAdmin = user?.role === 'admin'
  const isModerator = user?.role === 'moderator'
  const isCustomer = user?.role === 'customer'

  return (
    <nav className="bg-black/50 backdrop-blur-lg border-b border-gray-800 shadow-xl sticky top-0 z-40">

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="logo-container w-9 h-9 ">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            
          </Link>



          {/* Navigation principale - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className={`transition-all duration-300 transform hover:scale-105 ${
                pathname === '/products'
                  ? 'text-orange-500 font-semibold'
                  : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Produits
            </Link>
            <Link
              href="/products/homme"
              className={`transition-all duration-300 transform hover:scale-105 ${
                pathname === '/products/homme'
                  ? 'text-orange-500 font-semibold'
                  : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Homme
            </Link>
            <Link
              href="/products/femme"
              className={`transition-all duration-300 transform hover:scale-105 ${
                pathname === '/products/femme'
                  ? 'text-orange-500 font-semibold'
                  : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Femme
            </Link>
            <Link
              href="/products/enfant"
              className={`transition-all duration-300 transform hover:scale-105 ${
                pathname === '/products/enfant'
                  ? 'text-orange-500 font-semibold'
                  : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Enfant
            </Link>
            <Link
              href="/products/nouveautes"
              className={`transition-all duration-300 transform hover:scale-105 ${
                pathname === '/products/nouveautes'
                  ? 'text-orange-500 font-semibold'
                  : 'text-gray-300 hover:text-orange-500'
              }`}
            >
              Nouveautés
            </Link>
            <Link
              href="/products/soldes"
              className={`transition-all duration-300 transform hover:scale-105 ${
                pathname === '/products/soldes'
                  ? 'text-orange-500 font-semibold'
                  : 'text-red-400 hover:text-orange-500 font-semibold'
              }`}
            >
              Soldes
            </Link>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Barre de recherche avancée */}
            <SearchBar 
              className="w-64" 
              placeholder="Rechercher produits, marques..." 
            />

            {/* Favoris */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white">
                <Heart className="w-5 h-5" />
                {getWishlistCount() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getWishlistCount()}
                  </Badge>
                )}
              </Button>
            </Link>

            

            {/* Panier */}
            <Button variant="ghost" size="icon" onClick={toggleCart} className="relative text-gray-300 hover:text-white">
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {getTotalItems()}
                </Badge>
              )}
            </Button>

            {/* Menu utilisateur */}
            {user ? (
              <div className="relative group">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="hidden lg:block">{user?.name || user?.email}</span>
                </Button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mon Profil
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mes Commandes
                  </Link>
                  
                  {(isAdmin || isModerator) && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Link href="/admin/backoffice" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Package className="inline w-4 h-4 mr-2" />
                        Administration
                      </Link>
                      {isAdmin && (
                        <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Settings className="inline w-4 h-4 mr-2" />
                          Paramètres
                        </Link>
                      )}
                    </>
                  )}
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">Inscription</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-4">
              {/* Barre de recherche mobile */}
              <SearchBar 
                className="w-full" 
                placeholder="Rechercher produits, marques..." 
              />

                  {/* Navigation mobile */}
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="/products"
                      className="text-gray-300 hover:text-white transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Produits
                    </Link>
                    <Link
                      href="/products/homme"
                      className="text-gray-300 hover:text-white transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Homme
                    </Link>
                    <Link
                      href="/products/femme"
                      className="text-gray-300 hover:text-white transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Femme
                    </Link>
                    <Link
                      href="/products/enfant"
                      className="text-gray-300 hover:text-white transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Enfant
                    </Link>
                    <Link
                      href="/products/nouveautes"
                      className="text-gray-300 hover:text-white transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Nouveautés
                    </Link>
                    <Link
                      href="/products/soldes"
                      className="text-red-400 hover:text-red-300 transition-colors py-2 font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Soldes
                    </Link>
                  </div>

              {/* Actions mobile */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>

                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">{user?.name || user?.email}</span>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-300 hover:text-white">
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/signin">
                      <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">Connexion</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">Inscription</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CartSidebar />
    </nav>
  )
}
