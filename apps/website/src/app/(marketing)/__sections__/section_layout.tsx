import { Box, TypographyProps } from '@mui/material';
import { Typography } from '@palico-ai/components';
import React from 'react';

export interface SectionLayoutProps {
  title?: string;
  titleHeader?: TypographyProps['variant'];
  children: React.ReactNode;
  alignTitle?: TypographyProps['textAlign'];
  disableGutter?: boolean;
  disableTitleGutter?: boolean;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  disableGutter,
  disableTitleGutter,
  titleHeader = 'h2',
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
        <Box
          sx={{
            mb: disableTitleGutter ? 0 : 14,
          }}
        >
          <Typography variant={titleHeader} textAlign={alignTitle}>
            {title}
          </Typography>
        </Box>
      )}
      {children}
    </Box>
  );
};

export default SectionLayout;
