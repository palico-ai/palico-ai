'use client';

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
          <Typography
            sx={(theme) => ({
              // color: theme.palette.primary.main,
              // textShadow: `0px 0px 5px ${theme.palette.primary.main}`,
              background: `linear-gradient(75deg, ${theme.palette.primary.light} 0%, ${theme.palette.info.light} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            })}
            variant={titleHeader}
            textAlign={alignTitle}
          >
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
