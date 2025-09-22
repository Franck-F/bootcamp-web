'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight, CreditCard, Shield, Truck, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Section principale */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-5 h-5 g-white rounded-xl flex items-center justify-center">
                <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
              </div>
              <span className="text-2xl font-bold text-white">SneakPeak</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-md text-lg leading-relaxed">
              Votre destination premium pour les sneakers les plus exclusives. 
              Qualité exceptionnelle, style unique et service client d'exception.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Restez informé</h4>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                />
                <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Recevez nos dernières nouveautés et offres exclusives
              </p>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Boutique</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/products" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Tous les produits
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/homme" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Homme
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/femme" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Femme
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/enfant" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Enfant
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/nouveautes" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Nouveautés
                    </Link>
                  </li>
                  <li>
                    <Link href="/products/soldes" className="text-red-400 hover:text-red-300 transition-colors flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Soldes
                    </Link>
                  </li>
                </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Retours
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Guide des tailles
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section des avantages */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Livraison gratuite</h5>
                <p className="text-sm text-gray-400">Dès 50€ d'achat</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Paiement sécurisé</h5>
                <p className="text-sm text-gray-400">SSL 256 bits</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Support 24/7</h5>
                <p className="text-sm text-gray-400">Service client</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Retours faciles</h5>
                <p className="text-sm text-gray-400">30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des réseaux sociaux et contact */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Réseaux sociaux */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors group">
                  <Facebook className="w-6 h-6 text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors group">
                  <Twitter className="w-6 h-6 text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors group">
                  <Instagram className="w-6 h-6 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-400">contact@sneakpeak.fr</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-400">01 04 05 06 07</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-400">123 Rue de la Mode, 75001 Paris</span>
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Paiement sécurisé</h4>
              <div className="flex space-x-2">
                <div className="bg-white rounded-lg px-3 py-2 text-xs font-semibold text-gray-900">VISA</div>
                <div className="bg-white rounded-lg px-3 py-2 text-xs font-semibold text-gray-900">MC</div>
                <div className="bg-white rounded-lg px-3 py-2 text-xs font-semibold text-gray-900">PayPal</div>
                <div className="bg-white rounded-lg px-3 py-2 text-xs font-semibold text-gray-900">Apple Pay</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section légale */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} SneakPeak. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                SIRET: 123 456 789 00012 | TVA: FR12 123456789
              </p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Conditions
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                Cookies
              </Link>
              <Link href="/legal" className="text-gray-400 hover:text-white transition-colors text-sm">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
