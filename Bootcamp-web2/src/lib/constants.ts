import { SizeChart } from '../types';

export const SITE_NAME = 'StrideStyle';
export const SITE_DESCRIPTION = 'Premium sneakers for every step of your journey';

export const SIZE_CHARTS: SizeChart = {
  kids: ['22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
  men: ['39', '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5', '45', '45.5', '46', '47', '48'],
  women: ['35', '35.5', '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5', '40', '40.5', '41', '42'],
};

export const COLORS = [
  'Blanc', 'Noir', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Rose',
  'Violet', 'Marron', 'Gris', 'Marine', 'Beige', 'Kaki', 'Bordeaux', 'Turquoise',
  'Crème', 'Argent', 'Or', 'Bronze', 'Corail', 'Lavande', 'Menthe', 'Saumon',
  'Olive', 'Indigo', 'Magenta', 'Cyan', 'Lime', 'Fuchsia', 'Taupe', 'Ivoire'
];

export const MATERIALS = [
  'Cuir', 'Toile', 'Mesh', 'Synthétique', 'Daim', 'Tricot', 'Caoutchouc', 'Tissu',
  'Nubuck', 'Textile', 'Microfibre', 'Néoprène', 'Gore-Tex', 'Flyknit', 'Primeknit',
  'Boost', 'Air Max', 'React', 'Zoom Air', 'Gel', 'Fresh Foam', 'CloudTec'
];

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Processing', color: 'bg-orange-100 text-orange-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export const PAYMENT_METHODS = [
  { id: 'credit-card', label: 'Credit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'apple-pay', label: 'Apple Pay', icon: '🍎' },
  { id: 'google-pay', label: 'Google Pay', icon: '📱' },
];

// Helper function to get color hex values for display
export const getColorHex = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Blanc': '#FFFFFF',
    'Noir': '#000000',
    'Rouge': '#DC2626',
    'Bleu': '#2563EB',
    'Vert': '#16A34A',
    'Jaune': '#EAB308',
    'Orange': '#EA580C',
    'Rose': '#EC4899',
    'Violet': '#7C3AED',
    'Marron': '#A16207',
    'Gris': '#6B7280',
    'Marine': '#1E3A8A',
    'Beige': '#D6D3D1',
    'Kaki': '#84CC16',
    'Bordeaux': '#7F1D1D',
    'Turquoise': '#06B6D4',
    'Crème': '#FEF3C7',
    'Argent': '#9CA3AF',
    'Or': '#F59E0B',
    'Bronze': '#A16207',
    'Corail': '#FB7185',
    'Lavande': '#A78BFA',
    'Menthe': '#6EE7B7',
    'Saumon': '#FCA5A5',
    'Olive': '#65A30D',
    'Indigo': '#4F46E5',
    'Magenta': '#D946EF',
    'Cyan': '#06B6D4',
    'Lime': '#84CC16',
    'Fuchsia': '#E879F9',
    'Taupe': '#78716C',
    'Ivoire': '#FFFBEB'
  };
  
  return colorMap[colorName] || '#6B7280';
};