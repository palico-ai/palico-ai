'use client';

import { Box, Divider, styled } from '@mui/material';
import { Button, Link, Typography } from '@palico-ai/components';
import React from 'react';
import SectionLayout from '../section_layout';
import RoutePath from '../../../../utils/route_path';

const AccuracySpan = styled('span')(({ theme }) => ({
  color: theme.palette.primary.light,
}));

const ExperimentSpan = styled('span')(({ theme }) => ({
  color: theme.palette.info.light,
}));

const LandingPageHeader: React.FC = () => {
  return (
    <SectionLayout disableGutter>
      <Box
        sx={{
          py: {
            xs: 8,
            md: 12,
            lg: 16,
            xl: 24,
          },
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          <Typography variant="h1" gutterBottom whiteSpace={'pre-line'}>
            Improve <AccuracySpan>Accuracy</AccuracySpan> with Rapid{' '}
            <ExperimentSpan>Experimentation</ExperimentSpan>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontSize={18} whiteSpace={'pre-line'}>
            Accuracy improvement requires running <b>hundreds of experiments</b>{' '}
            with different prompt techniques, LLM models, rag-pipeline versions,
            and more. <b>Streamline your experimentation</b> process to reach{' '}
            <b>production-level accuracy</b> in weeks instead of months.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            <Link href={RoutePath.quickStart()}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                sx={{ mt: 4 }}
              >
                Quickstart
              </Button>
            </Link>
            <Link href={RoutePath.docs()}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                sx={{ mt: 4 }}
              >
                Documentation
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </SectionLayout>
  );
};

export default LandingPageHeader;
