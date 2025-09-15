import React from 'react';
import { MaterialHeroSection } from '../components/home/MaterialHeroSection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { BrandShowcase } from '../components/home/BrandShowcase';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { ProductGrid } from '../components/product/ProductGrid';

export function HomePage() {
  return (
    <main>
      <MaterialHeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <BrandShowcase />
      
      {/* All Products Section */}
      <section className="py-20 bg-white">
        <ProductGrid 
          title="Toute notre collection"
          subtitle="Découvrez plus de 100 modèles exclusifs des plus grandes marques"
        />
      </section>
    </main>
  );
}