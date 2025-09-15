import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Product, FilterOptions } from '../../types';
import { MOCK_PRODUCTS, MOCK_BRANDS, MOCK_CATEGORIES } from '../../lib/mockData';
import { SIZE_CHARTS } from '../../lib/constants';
import { debounce } from '../../lib/utils';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  filters?: Partial<FilterOptions>;
}

export function ProductGrid({ title = "Nos Sneakers", subtitle, filters }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    categories: filters?.categories || [],
    brands: filters?.brands || [],
    sizes: filters?.sizes || [],
    colors: filters?.colors || [],
    priceRange: filters?.priceRange || [0, 500],
    targetAudience: filters?.targetAudience || 'all',
  });
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'brand' | 'newest'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];

    // Apply search
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (currentFilters.targetAudience !== 'all') {
      products = products.filter(product =>
        product.category?.target_audience === currentFilters.targetAudience
      );
    }

    if (currentFilters.categories.length > 0) {
      products = products.filter(product =>
        product.category_id && currentFilters.categories.includes(product.category_id)
      );
    }

    if (currentFilters.brands.length > 0) {
      products = products.filter(product =>
        product.brand_id && currentFilters.brands.includes(product.brand_id)
      );
    }

    if (currentFilters.sizes.length > 0) {
      products = products.filter(product =>
        product.variants?.some(variant =>
          currentFilters.sizes.includes(variant.size) && variant.stock_quantity > 0
        )
      );
    }

    if (currentFilters.colors.length > 0) {
      products = products.filter(product =>
        currentFilters.colors.includes(product.color)
      );
    }
    // Apply price range
    products = products.filter(product =>
      product.base_price >= currentFilters.priceRange[0] &&
      product.base_price <= currentFilters.priceRange[1]
    );

    // Apply sorting
    products.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.base_price - b.base_price;
        case 'brand':
          return (a.brand?.name || '').localeCompare(b.brand?.name || '');
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return products;
  }, [searchTerm, currentFilters, sortBy]);

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setCurrentFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setCurrentFilters({
      categories: [],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: [0, 500],
      targetAudience: 'all',
    });
    setSearchTerm('');
  };

  const activeFiltersCount = 
    currentFilters.categories.length +
    currentFilters.brands.length +
    currentFilters.sizes.length +
    currentFilters.colors.length +
    currentFilters.colors.length +
    (currentFilters.targetAudience !== 'all' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom, marque, couleur..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="newest">Plus récent</option>
            <option value="name">Nom A-Z</option>
            <option value="price">Prix croissant</option>
            <option value="brand">Marque A-Z</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Filtres actifs:</span>
          <div className="flex flex-wrap gap-2">
            {currentFilters.targetAudience !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                {currentFilters.targetAudience === 'men' ? 'Homme' : 
                 currentFilters.targetAudience === 'women' ? 'Femme' : 'Enfant'}
              </span>
            )}
            {currentFilters.colors.map(color => (
              <span key={color} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {color}
                <button
                  onClick={() => handleFilterChange('colors', currentFilters.colors.filter(c => c !== color))}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Effacer tout
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
          </p>
          <Button onClick={clearFilters}>
            Effacer tous les filtres
          </Button>
        </div>
      )}

      {/* Filter Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtres"
        size="lg"
      >
        <FilterPanel
          filters={currentFilters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      </Modal>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          size="xl"
        >
          <ProductQuickView
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </Modal>
      )}
    </div>
  );
}

// Filter Panel Component
function FilterPanel({
  filters,
  onFilterChange,
  onClose,
}: {
  filters: FilterOptions;
  onFilterChange: (filterType: keyof FilterOptions, value: any) => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Target Audience */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Catégorie</h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'men', label: 'Hommes' },
            { value: 'women', label: 'Femmes' },
            { value: 'kids', label: 'Enfants' },
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3">
              <input
                type="radio"
                name="targetAudience"
                value={option.value}
                checked={filters.targetAudience === option.value}
                onChange={(e) => onFilterChange('targetAudience', e.target.value)}
                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Marques</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {MOCK_BRANDS.map(brand => (
            <label key={brand.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.id)}
                onChange={(e) => {
                  const newBrands = e.target.checked
                    ? [...filters.brands, brand.id]
                    : filters.brands.filter(id => id !== brand.id);
                  onFilterChange('brands', newBrands);
                }}
                className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
              />
              <span className="text-gray-700">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Couleurs</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {COLORS.map(color => (
            <label key={color} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={(e) => {
                  const newColors = e.target.checked
                    ? [...filters.colors, color]
                    : filters.colors.filter(c => c !== color);
                  onFilterChange('colors', newColors);
                }}
                className="w-4 h-4 text-black focus:ring-gray-500 rounded"
              />
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ 
                    backgroundColor: getColorHex(color)
                  }}
                />
                <span className="text-gray-700">{color}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Prix</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="500"
            value={filters.priceRange[1]}
            onChange={(e) => onFilterChange('priceRange', [0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0€</span>
            <span>jusqu'à {filters.priceRange[1]}€</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-6">
        <Button onClick={onClose} fullWidth>
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
}

// Product Quick View Component
function ProductQuickView({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();

  const availableVariants = product.variants?.filter(v => v.stock_quantity > 0) || [];
  const selectedVariant = availableVariants.find(v => v.size === selectedSize);

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product, selectedVariant);
      onClose();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image_urls?.[selectedImageIndex] || product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {product.image_urls && product.image_urls.length > 1 && (
          <div className="flex space-x-2">
            {product.image_urls.map((url, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  selectedImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div>
          <p className="text-orange-500 font-medium">{product.brand?.name}</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatPrice(product.base_price)}
          </p>
        </div>

        <p className="text-gray-600">{product.description}</p>

        {/* Size Selection */}
        {availableVariants.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Choisir une taille
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {availableVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`p-3 text-center border rounded-lg transition-colors ${
                    selectedSize === variant.size
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">{variant.size}</div>
                  <div className="text-xs text-gray-500">
                    {variant.stock_quantity} dispo.
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Couleur:</span>
            <span className="ml-2">{product.color}</span>
          </div>
          <div>
            <span className="font-medium">Matière:</span>
            <span className="ml-2">{product.material}</span>
          </div>
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant}
          fullWidth
          size="lg"
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}