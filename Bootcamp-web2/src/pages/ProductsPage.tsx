import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductGrid } from '../components/product/ProductGrid';

interface ProductsPageProps {
  category?: 'men' | 'women' | 'kids';
  filter?: 'new' | 'sale';
}

export function ProductsPage({ category, filter }: ProductsPageProps) {
  const getTitle = () => {
    if (category === 'men') return 'Collection Homme';
    if (category === 'women') return 'Collection Femme';
    if (category === 'kids') return 'Collection Enfant';
    if (filter === 'new') return 'Nouveautés';
    return 'Toutes nos marques';
  };

  const getSubtitle = () => {
    if (category === 'men') return 'Des sneakers conçues pour l\'homme moderne';
    if (category === 'women') return 'Élégance et confort pour toutes les occasions';
    if (category === 'kids') return 'Des chaussures adaptées aux petits explorateurs';
    if (filter === 'new') return 'Les dernières sorties et tendances';
    return 'Découvrez toutes nos marques partenaires';
  };

  const filters = {
    targetAudience: category || 'all',
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    priceRange: [0, 500] as [number, number],
  };

  return (
    <div className="pt-8">
      <ProductGrid 
        title={getTitle()}
        subtitle={getSubtitle()}
        filters={filters}
      />
    </div>
  );
}