'use client';

import { Box, Divider, styled } from '@mui/material';
import { Button, Typography } from '@palico-ai/components';
import React from 'react';
import SectionLayout from '../section_layout';
import { LandingPageData } from '../../data';

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
          py: 24,
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
            Improve <AccuracySpan>Accuracy</AccuracySpan> with{'\n'}
            <ExperimentSpan>Experiment-Driven</ExperimentSpan> {` `}
            Development
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" fontSize={17} whiteSpace={'pre-line'}>
            {LandingPageData.header.subtitle.v2}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              size="large"
              color="primary"
              sx={{ mt: 4 }}
            >
              Quickstart
            </Button>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{ mt: 4 }}
            >
              Documentation
            </Button>
          </Box>
        </Box>
      </Box>
    </SectionLayout>
  );
};

export default LandingPageHeader;
