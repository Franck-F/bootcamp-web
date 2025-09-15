import { Brand, Category, Product, ProductVariant } from '../types';
import { SIZE_CHARTS, COLORS, MATERIALS } from './constants';

export const MOCK_BRANDS: Brand[] = [
  { id: '1', name: 'Nike', created_at: new Date().toISOString() },
  { id: '2', name: 'Adidas', created_at: new Date().toISOString() },
  { id: '3', name: 'Puma', created_at: new Date().toISOString() },
  { id: '4', name: 'New Balance', created_at: new Date().toISOString() },
  { id: '5', name: 'Converse', created_at: new Date().toISOString() },
  { id: '6', name: 'Vans', created_at: new Date().toISOString() },
  { id: '7', name: 'Reebok', created_at: new Date().toISOString() },
  { id: '8', name: 'Jordan', created_at: new Date().toISOString() },
  { id: '9', name: 'Asics', created_at: new Date().toISOString() },
  { id: '10', name: 'Under Armour', created_at: new Date().toISOString() },
  { id: '11', name: 'Skechers', created_at: new Date().toISOString() },
  { id: '12', name: 'Fila', created_at: new Date().toISOString() },
  { id: '13', name: 'Timberland', created_at: new Date().toISOString() },
  { id: '14', name: 'Dr. Martens', created_at: new Date().toISOString() },
  { id: '15', name: 'Clarks', created_at: new Date().toISOString() },
  { id: '16', name: 'Salomon', created_at: new Date().toISOString() },
  { id: '17', name: 'Merrell', created_at: new Date().toISOString() },
  { id: '18', name: 'Hoka', created_at: new Date().toISOString() },
  { id: '19', name: 'Brooks', created_at: new Date().toISOString() },
  { id: '20', name: 'Mizuno', created_at: new Date().toISOString() },
  { id: '21', name: 'Saucony', created_at: new Date().toISOString() },
  { id: '22', name: 'Kappa', created_at: new Date().toISOString() },
  { id: '23', name: 'Diadora', created_at: new Date().toISOString() },
  { id: '24', name: 'Umbro', created_at: new Date().toISOString() },
  { id: '25', name: 'Le Coq Sportif', created_at: new Date().toISOString() },
  { id: '26', name: 'Lacoste', created_at: new Date().toISOString() },
  { id: '27', name: 'Champion', created_at: new Date().toISOString() },
  { id: '28', name: 'Palladium', created_at: new Date().toISOString() },
  { id: '29', name: 'Caterpillar', created_at: new Date().toISOString() },
  { id: '30', name: 'Geox', created_at: new Date().toISOString() },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Running', slug: 'running', target_audience: 'men', created_at: new Date().toISOString() },
  { id: '2', name: 'Basketball', slug: 'basketball', target_audience: 'men', created_at: new Date().toISOString() },
  { id: '3', name: 'Lifestyle', slug: 'lifestyle', target_audience: 'men', created_at: new Date().toISOString() },
  { id: '4', name: 'Training', slug: 'training', target_audience: 'men', created_at: new Date().toISOString() },
  { id: '5', name: 'Football', slug: 'football', target_audience: 'men', created_at: new Date().toISOString() },
  { id: '6', name: 'Tennis', slug: 'tennis', target_audience: 'men', created_at: new Date().toISOString() },
  { id: '7', name: 'Skateboard', slug: 'skateboard', target_audience: 'men', created_at: new Date().toISOString() },
  { id: '8', name: 'Randonnée', slug: 'randonnee', target_audience: 'men', created_at: new Date().toISOString() },
  { id: '9', name: 'Running', slug: 'running-women', target_audience: 'women', created_at: new Date().toISOString() },
  { id: '10', name: 'Lifestyle', slug: 'lifestyle-women', target_audience: 'women', created_at: new Date().toISOString() },
  { id: '11', name: 'Training', slug: 'training-women', target_audience: 'women', created_at: new Date().toISOString() },
  { id: '12', name: 'Fashion', slug: 'fashion-women', target_audience: 'women', created_at: new Date().toISOString() },
  { id: '13', name: 'Fitness', slug: 'fitness-women', target_audience: 'women', created_at: new Date().toISOString() },
  { id: '14', name: 'Tennis', slug: 'tennis-women', target_audience: 'women', created_at: new Date().toISOString() },
  { id: '15', name: 'Casual', slug: 'casual-kids', target_audience: 'kids', created_at: new Date().toISOString() },
  { id: '16', name: 'Sports', slug: 'sports-kids', target_audience: 'kids', created_at: new Date().toISOString() },
  { id: '17', name: 'École', slug: 'ecole-kids', target_audience: 'kids', created_at: new Date().toISOString() },
  { id: '18', name: 'Outdoor', slug: 'outdoor-kids', target_audience: 'kids', created_at: new Date().toISOString() },
];

const SHOE_TYPES = [
  'Air Max', 'Air Force', 'Dunk', 'Blazer', 'Cortez', 'React', 'Zoom', 'Free',
  'Stan Smith', 'Superstar', 'Gazelle', 'Campus', 'Samba', 'Forum', 'Ozweego', 'NMD',
  'Suede', 'RS-X', 'Cali', 'Thunder', 'Future Rider', 'Mayze', 'Clyde', 'Cell',
  '990', '574', '327', '2002R', '550', '9060', 'Fresh Foam', 'FuelCell',
  'Chuck Taylor', 'One Star', 'Pro Leather', 'Run Star Hike', 'Platform',
  'Old Skool', 'Authentic', 'Era', 'Slip-On', 'SK8-Hi', 'Knu Skool',
  'Club C', 'Classic Leather', 'Instapump Fury', 'Zig Kinetica', 'Nano',
  'Retro', 'Mid', 'Low', 'High', 'OG', 'Vintage', 'Heritage', 'Premium'
];

const DESCRIPTIVE_WORDS = [
  'Essential', 'Classic', 'Modern', 'Vintage', 'Premium', 'Limited', 'Special',
  'Pro', 'Elite', 'Performance', 'Comfort', 'Style', 'Urban', 'Street',
  'Original', 'Authentic', 'Heritage', 'Innovation', 'Dynamic', 'Fresh'
];

const generateProductName = (brand: string, shoeType: string, color: string): string => {
  const descriptive = DESCRIPTIVE_WORDS[Math.floor(Math.random() * DESCRIPTIVE_WORDS.length)];
  const hasDescriptive = Math.random() > 0.5;
  
  if (hasDescriptive) {
    return `${brand} ${descriptive} ${shoeType} ${color}`;
  }
  return `${brand} ${shoeType} ${color}`;
};

const generateDescription = (brand: string, category: string, material: string, color: string): string => {
  const descriptions = [
    `Découvrez ces sneakers ${brand.toLowerCase()} au design moderne et élégant. Parfaites pour le ${category.toLowerCase()}, elles allient style et performance.`,
    `Ces chaussures ${brand.toLowerCase()} en ${material.toLowerCase()} offrent un confort exceptionnel et un look ${color.toLowerCase()} tendance.`,
    `Adoptez le style ${brand.toLowerCase()} avec ces sneakers ${color.toLowerCase()} conçues pour la ${category.toLowerCase()}. Matière ${material.toLowerCase()} de qualité premium.`,
    `Sneakers ${brand.toLowerCase()} ${color.toLowerCase()} au design iconique. Idéales pour le ${category.toLowerCase()}, elles garantissent style et durabilité.`,
    `Chaussures ${brand.toLowerCase()} en ${material.toLowerCase()} ${color.toLowerCase()}. Un must-have pour tous les passionnés de ${category.toLowerCase()}.`,
    `Style urbain et performance se rencontrent dans ces sneakers ${brand.toLowerCase()}. Coloris ${color.toLowerCase()}, parfaites pour le ${category.toLowerCase()}.`,
    `Découvrez l'innovation ${brand.toLowerCase()} avec ces chaussures ${color.toLowerCase()} en ${material.toLowerCase()}. Confort et style assurés.`,
    `Sneakers ${brand.toLowerCase()} ${color.toLowerCase()} au design authentique. Matière ${material.toLowerCase()} premium pour un confort optimal.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const SHOE_IMAGES = [
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1407354/pexels-photo-1407354.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1456737/pexels-photo-1456737.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1407343/pexels-photo-1407343.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1456735/pexels-photo-1456735.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1407355/pexels-photo-1407355.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1407356/pexels-photo-1407356.jpeg?auto=compress&cs=tinysrgb&w=800'
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  let productId = 1;

  // Générer 500 produits
  for (let i = 0; i < 500; i++) {
    const brand = MOCK_BRANDS[Math.floor(Math.random() * MOCK_BRANDS.length)];
    const category = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const material = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
    const shoeType = SHOE_TYPES[Math.floor(Math.random() * SHOE_TYPES.length)];
    const basePrice = Math.floor(Math.random() * 300) + 50; // Prix entre 50€ et 350€
    const imageIndex = Math.floor(Math.random() * SHOE_IMAGES.length);
    
    const product: Product = {
      id: productId.toString(),
      name: generateProductName(brand.name, shoeType, color),
      slug: `${brand.name.toLowerCase().replace(/\s+/g, '-')}-${shoeType.toLowerCase().replace(/\s+/g, '-')}-${color.toLowerCase()}-${productId}`,
      description: generateDescription(brand.name, category.name, material, color),
      brand_id: brand.id,
      category_id: category.id,
      base_price: basePrice,
      image_url: SHOE_IMAGES[imageIndex],
      image_urls: [
        SHOE_IMAGES[imageIndex],
        SHOE_IMAGES[(imageIndex + 1) % SHOE_IMAGES.length],
        SHOE_IMAGES[(imageIndex + 2) % SHOE_IMAGES.length],
      ],
      color,
      material,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(), // Date aléatoire dans l'année
      updated_at: new Date().toISOString(),
      brand,
      category,
    };

    products.push(product);
    productId++;
  }

  return products;
};

const generateVariants = (products: Product[]): ProductVariant[] => {
  const variants: ProductVariant[] = [];
  let variantId = 1;

  products.forEach(product => {
    if (!product.category) return;
    
    const sizes = SIZE_CHARTS[product.category.target_audience];
    
    // Générer des variantes pour un sous-ensemble aléatoire de tailles
    const numSizes = Math.floor(Math.random() * 10) + 5; // 5-15 tailles disponibles
    const availableSizes = sizes.slice().sort(() => 0.5 - Math.random()).slice(0, numSizes);

    availableSizes.forEach(size => {
      const stockQuantity = Math.floor(Math.random() * 25) + 1; // 1-25 items en stock
      
      const variant: ProductVariant = {
        id: variantId.toString(),
        product_id: product.id,
        size,
        stock_quantity: stockQuantity,
        sku: `${product.brand?.name.substring(0, 3).toUpperCase()}-${product.id.padStart(3, '0')}-${size}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      variants.push(variant);
      variantId++;
    });
  });

  return variants;
};

export const MOCK_PRODUCTS = generateProducts();
export const MOCK_VARIANTS = generateVariants(MOCK_PRODUCTS);

// Ajouter les variantes aux produits
MOCK_PRODUCTS.forEach(product => {
  product.variants = MOCK_VARIANTS.filter(v => v.product_id === product.id);
});