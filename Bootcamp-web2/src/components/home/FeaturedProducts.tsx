import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { Button } from '../ui/Button';
import { MOCK_PRODUCTS } from '../../lib/mockData';

export function FeaturedProducts() {
  // Get featured products (first 8 products with good stock)
  const featuredProducts = MOCK_PRODUCTS
    .filter(product => (product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0) > 10)
    .slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <span className="text-orange-600 font-medium">Tendances du moment</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nos coups de <span className="text-orange-500">cœur</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection exclusive des sneakers les plus populaires, 
            choisies par nos experts pour leur style et leur qualité exceptionnelle.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="group">
            Voir toute la collection
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}