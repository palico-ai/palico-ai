import React from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';

export interface ErrorMessageProps {
  message: string;
  textAlign?: TypographyProps['textAlign']; // default: center
  centerInContainer?: boolean; // default: false
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  textAlign = 'center',
  centerInContainer: centerWithDiv = false,
}) => {
  if (centerWithDiv) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" color="error">
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <Typography variant="h6" color="error" textAlign={textAlign}>
      {message}
    </Typography>
  );
};
