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
  alignTitle = 'center',
  children,
}) => {
  return (
    <Box
      sx={{
        mb: disableGutter ? 0 : 18,
      }}
    >
      {title && (
        <Typography
          variant="h2"
          textAlign={alignTitle}
          sx={{
            mb: 12,
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default SectionLayout;
