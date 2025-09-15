import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

interface MaterialButtonProps extends Omit<MuiButtonProps, 'size'> {
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function MaterialButton({ 
  children, 
  loading = false, 
  disabled,
  size = 'medium',
  ...props 
}: MaterialButtonProps) {
  return (
    <MuiButton
      {...props}
      size={size}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : props.startIcon}
    >
      {children}
    </MuiButton>
  );
}

export default MaterialButton;