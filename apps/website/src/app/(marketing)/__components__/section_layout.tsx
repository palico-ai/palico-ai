import { Box, TypographyProps } from '@mui/material';
import { Typography } from '@palico-ai/components';
import React from 'react';

export interface SectionLayoutProps {
  title?: string;
  subtitle?: TypographyProps['children'];
  titleHeader?: TypographyProps['variant'];
  children: React.ReactNode;
  alignTitle?: TypographyProps['textAlign'];
  disableGutter?: boolean;
  disableTitleGutter?: boolean;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  subtitle,
  disableGutter,
  disableTitleGutter,
  titleHeader = 'h2',
  alignTitle = 'left',
  children,
}) => {
  return (
    <Box
      sx={{
        mb: disableGutter ? 0 : 24,
      }}
    >
      {title && (
        <Box
          sx={{
            mb: disableTitleGutter ? 0 : 12,
          }}
        >
          <Typography variant={titleHeader} textAlign={alignTitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              fontSize={20}
              textAlign={alignTitle}
              mt={4}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
};

export default SectionLayout;
