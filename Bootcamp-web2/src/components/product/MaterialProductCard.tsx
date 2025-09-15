import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ShoppingCart, Favorite, Visibility } from '@mui/icons-material';
import { Product } from '../../types';
import { formatPrice, getTotalStock, getAvailableSizes } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';

interface MaterialProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

export function MaterialProductCard({ product, onQuickView }: MaterialProductCardProps) {
  const { addItem } = useCart();
  const totalStock = getTotalStock(product.variants || []);
  const availableSizes = getAvailableSizes(product.variants || []);
  const isInStock = totalStock > 0;

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
      const firstAvailableVariant = product.variants.find(v => v.stock_quantity > 0);
      if (firstAvailableVariant) {
        addItem(product, firstAvailableVariant);
      }
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={product.image_url}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
          {!isInStock && (
            <Chip label="Épuisé" color="error" size="small" />
          )}
          {Math.random() < 0.3 && (
            <Chip label="Nouveau" color="primary" size="small" />
          )}
        </Box>

        {/* Hover Actions */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.MuiCard-root:hover &': {
              opacity: 1,
            },
          }}
        >
          <Tooltip title="Ajouter aux favoris">
            <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
              <Favorite />
            </IconButton>
          </Tooltip>
          <Tooltip title="Aperçu rapide">
            <IconButton size="small" sx={{ bgcolor: 'background.paper' }} onClick={onQuickView}>
              <Visibility />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Brand */}
        <Typography variant="caption" color="primary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
          {product.brand?.name}
        </Typography>

        {/* Product Name */}
        <Typography variant="h6" component="h3" sx={{ mb: 1, lineHeight: 1.3 }}>
          {product.name}
        </Typography>

        {/* Category & Color */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.category?.name} • {product.color}
        </Typography>

        {/* Available Sizes */}
        {availableSizes.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Tailles disponibles:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {availableSizes.slice(0, 6).map((size) => (
                <Chip
                  key={size}
                  label={size}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 24 }}
                />
              ))}
              {availableSizes.length > 6 && (
                <Chip
                  label={`+${availableSizes.length - 6}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 24 }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            {formatPrice(product.base_price)}
          </Typography>
          {totalStock <= 5 && totalStock > 0 && (
            <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
              Plus que {totalStock} !
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={!isInStock}
          sx={{ borderRadius: 2 }}
        >
          {isInStock ? 'Ajouter au panier' : 'Épuisé'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default MaterialProductCard;