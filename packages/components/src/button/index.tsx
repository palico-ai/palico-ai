import React from 'react';
import {
  Box,
  CircularProgress,
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from '@mui/material';

export interface ButtonProps extends MUIButtonProps {
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  loading,
  disabled,
  children,
  ...rest
}) => {
  return (
    <MUIButton disabled={disabled || loading} {...rest}>
      <Box sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}>
        {loading && <CircularProgress color="info" size={18} />}
        {children}
      </Box>
    </MUIButton>
  );
};

export {
  IconButton,
} from "@mui/material"