import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PlayArrow, ArrowForward, Star } from '@mui/icons-material';

export function MaterialHeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))',
        }}
      />

      {/* Floating Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: 256,
          height: 256,
          background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} lg={8}>
            {/* Badge */}
            <Chip
              icon={<Star />}
              label="Collection Premium 2025"
              sx={{
                mb: 4,
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            />

            {/* Main Heading */}
            <Typography
              variant={isMobile ? 'h2' : 'h1'}
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              Chaque pas{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                raconte votre
              </Box>
              <br />
              style
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: 'grey.300',
                maxWidth: 600,
                lineHeight: 1.5,
              }}
            >
              Découvrez notre collection exclusive de sneakers premium. 
              Des marques légendaires aux dernières innovations, 
              trouvez la paire qui vous ressemble.
            </Typography>

            {/* Stats */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {[
                { value: '100+', label: 'Modèles exclusifs' },
                { value: '15', label: 'Marques premium' },
                { value: '24h', label: 'Livraison express' },
              ].map((stat) => (
                <Grid item key={stat.label}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'grey.400', textTransform: 'uppercase' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* CTA Buttons */}
            <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mb: 6 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #333333 30%, #000000 90%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Découvrir la collection
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Voir le lookbook
              </Button>
            </Stack>

            {/* Social Proof */}
            <Stack direction="row" spacing={4} alignItems="center" sx={{ color: 'grey.400' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Stack direction="row" spacing={-1}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
                        border: '2px solid #1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'white',
                      }}
                    >
                      {String.fromCharCode(64 + i)}
                    </Box>
                  ))}
                </Stack>
                <Typography variant="body2">+2K clients satisfaits</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Stack direction="row">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} sx={{ color: '#FFD700', fontSize: 16 }} />
                  ))}
                </Stack>
                <Typography variant="body2">4.9/5 • 500+ avis</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        <Typography variant="caption" sx={{ display: 'block', mb: 1, textTransform: 'uppercase' }}>
          Découvrir
        </Typography>
        <Box
          sx={{
            width: 24,
            height: 40,
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 12,
            position: 'relative',
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 12,
              bgcolor: 'rgba(255,255,255,0.6)',
              borderRadius: 2,
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'bounce 2s infinite',
            }}
          />
        </Box>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-8px); }
            60% { transform: translateX(-50%) translateY(-4px); }
          }
        `}
      </style>
    </Box>
  );
}

export default MaterialHeroSection;