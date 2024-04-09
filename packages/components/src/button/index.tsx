import React from 'react';
import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from '@mui/material';

export const Button: React.FC<MUIButtonProps> = ({
  ...rest
}) => {
  return <MUIButton {...rest} />;
};
