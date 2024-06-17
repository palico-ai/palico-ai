import { Box, TypographyProps } from '@mui/material';
import { Typography } from '@palico-ai/components';
import React from 'react';

export interface SectionLayoutProps {
  title?: string;
  children: React.ReactNode;
  alignTitle?: TypographyProps['textAlign'];
  disableGutter?: boolean;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  disableGutter,
  alignTitle = 'left',
  children,
}) => {
  return (
    <Box
      sx={{
        mb: disableGutter ? 0 : 18,
      }}
    >
      {title && (
        <Box sx={{ mb: 14 }}>
          <Typography variant="h2" textAlign={alignTitle}>
            {title}
          </Typography>
        </Box>
      )}
      {children}
    </Box>
  );
};

export default SectionLayout;
