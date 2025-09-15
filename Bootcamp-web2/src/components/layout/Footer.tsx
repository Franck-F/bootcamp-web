import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '../ui/Logo';

export function Footer() {
  const footerSections = [
    {
      title: 'Boutique',
      links: [
        { name: 'Hommes', href: '/men' },
        { name: 'Femmes', href: '/women' },
        { name: 'Enfants', href: '/kids' },
        { name: 'Marques', href: '/brands' },
        { name: 'Nouveautés', href: '/new' },
        { name: 'Promotions', href: '/sales' },
      ],
    },
    {
      title: 'Service Client',
      links: [
        { name: 'Guide des tailles', href: '/size-guide' },
        { name: 'Livraison', href: '/delivery' },
        { name: 'Retours', href: '/returns' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'À propos',
      links: [
        { name: 'Notre histoire', href: '/about' },
        { name: 'Nos magasins', href: '/stores' },
        { name: 'Carrières', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Partenariats', href: '/partnerships' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Restez connecté</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Inscrivez-vous à notre newsletter pour recevoir les dernières nouveautés, 
              offres exclusives et tendances sneakers en avant-première.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-r-lg font-medium transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo variant="white" />
            <p className="mt-4 text-gray-400 text-lg leading-relaxed">
              StrideStyle est votre destination premium pour les sneakers les plus 
              tendances. Nous proposons une sélection exclusive des meilleures marques 
              avec un service client exceptionnel.
            </p>
            
            {/* Contact Info */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">123 Rue de la Mode, 75001 Paris</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">contact@stridestyle.fr</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <p className="text-lg font-semibold mb-4">Suivez-nous</p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-gray-400 text-sm">
              <p>&copy; 2025 StrideStyle. Tous droits réservés.</p>
              <div className="flex space-x-6">
                <a href="/legal/privacy" className="hover:text-orange-500 transition-colors">
                  Politique de confidentialité
                </a>
                <a href="/legal/terms" className="hover:text-orange-500 transition-colors">
                  Conditions d'utilisation
                </a>
                <a href="/legal/cookies" className="hover:text-orange-500 transition-colors">
                  Politique des cookies
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Paiement sécurisé</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">
                  💳
                </div>
                <div className="w-8 h-5 bg-yellow-400 rounded text-xs text-black flex items-center justify-center font-bold">
                  🅿️
                </div>
                <div className="w-8 h-5 bg-black rounded text-xs text-white flex items-center justify-center font-bold">
                  🍎
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}