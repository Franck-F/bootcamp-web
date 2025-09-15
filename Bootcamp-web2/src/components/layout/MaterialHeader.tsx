import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Settings,
  Logout,
  Dashboard,
  Store,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';

export function MaterialHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Hommes', path: '/men' },
    { name: 'Femmes', path: '/women' },
    { name: 'Enfants', path: '/kids' },
    { name: 'Marques', path: '/brands' },
    { name: 'Nouveautés', path: '/new' },
  ];

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSignOut = () => {
    signOut();
    handleUserMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  return (
    <>
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mr: 2,
              }}
            >
              StrideStyle
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3 }}>
              {navigation.map((item) => (
                <Typography
                  key={item.name}
                  component="button"
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.name}
                </Typography>
              ))}
            </Box>
          )}

          {/* Search Bar */}
          {!isMobile && (
            <TextField
              size="small"
              placeholder="Rechercher des sneakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Mobile Search */}
            {isMobile && (
              <IconButton>
                <Search />
              </IconButton>
            )}

            {/* User Menu */}
            {user ? (
              <>
                <IconButton onClick={handleUserMenuOpen}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user.full_name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem disabled>
                    <ListItemText
                      primary={user.full_name}
                      secondary={user.email}
                    />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary="Mon profil" />
                  </MenuItem>
                  {(user.role === 'admin' || user.role === 'seller') && (
                    <MenuItem onClick={() => { 
                      handleUserMenuClose(); 
                      navigate(user.role === 'admin' ? '/admin' : '/seller'); 
                    }}>
                      <ListItemIcon>
                        {user.role === 'admin' ? <Dashboard /> : <Store />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={user.role === 'admin' ? 'Administration' : 'Espace vendeur'} 
                      />
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleSignOut}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton onClick={() => setShowAuthModal(true)}>
                <Person />
              </IconButton>
            )}

            {/* Cart */}
            <IconButton onClick={toggleCart}>
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Mobile Menu */}
            {isMobile && (
              <IconButton onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navigation.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton onClick={() => handleNavigation(item.path)}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default MaterialHeader;