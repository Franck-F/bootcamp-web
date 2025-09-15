import React from 'react';
import { Crown, Award, Zap } from 'lucide-react';
import { MOCK_BRANDS } from '../../lib/mockData';

export function BrandShowcase() {
  const brandLogos = [
    { name: 'Nike', logo: '✓' },
    { name: 'Adidas', logo: '◊' },
    { name: 'Puma', logo: '⚡' },
    { name: 'New Balance', logo: 'N' },
    { name: 'Converse', logo: '★' },
    { name: 'Vans', logo: 'V' },
    { name: 'Reebok', logo: 'R' },
    { name: 'Jordan', logo: '⚘' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
            <Crown className="h-5 w-5 text-blue-500" />
            <span className="text-blue-600 font-medium">Marques partenaires</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Les plus grandes <span className="text-blue-500">marques</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Nous collaborons avec les marques les plus prestigieuses du monde des sneakers 
            pour vous offrir l'excellence et l'authenticité à chaque pas.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {brandLogos.map((brand, index) => (
            <div
              key={brand.name}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300">
                  <span className="text-2xl font-bold text-gray-700 group-hover:text-orange-600">
                    {brand.logo}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {brand.name}
                </h3>
                <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Authenticité garantie</h3>
            <p className="text-gray-600">
              Tous nos produits sont 100% authentiques et proviennent directement 
              de nos partenaires officiels.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Exclusivités</h3>
            <p className="text-gray-600">
              Accédez en avant-première aux dernières sorties et aux éditions limitées 
              de vos marques préférées.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Service premium</h3>
            <p className="text-gray-600">
              Bénéficiez d'un accompagnement personnalisé et de conseils d'experts 
              pour trouver votre paire idéale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}