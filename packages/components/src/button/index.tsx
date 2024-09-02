import React from 'react';
import {
  Box,
  CircularProgress,
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from '@mui/material';
import { Link } from '../link';

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
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {loading && <CircularProgress color="info" size={18} />}
        {children}
      </Box>
    </MUIButton>
  );
};

interface LinkButtonProps extends ButtonProps {
  href: string;
  openInNewTab?: boolean;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  openInNewTab,
  ...rest
}) => {
  return (
    <Link href={href} target={openInNewTab ? '_blank' : undefined}>
      <Button {...rest} />
    </Link>
  );
};

export { IconButton } from '@mui/material';
