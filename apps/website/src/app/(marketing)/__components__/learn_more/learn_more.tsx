'use client';

import React from 'react';
import SectionLayout from '../section_layout';
import { Button, Link, Typography } from '@palico-ai/components';
import { Box, Container } from '@mui/material';
import AppRoute, { DocRoute } from '../../../../utils/route_path';
import { HighlightSpan } from '../client_fragments';
import SignupForNewsletter from './newsletter';

const CTA = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          gap: 2,
        }}
      >
        <Link href={DocRoute.quickStart()}>
          <Button variant="contained" color="primary" size="large" fullWidth>
            Start your project
          </Button>
        </Link>
        <Link href={AppRoute.scheduleDemo()} target="_blank">
          <Button variant="contained" color="secondary" size="large" fullWidth>
            Schedule a demo
          </Button>
        </Link>
      </Box>
      <Box
        mt={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          fontWeight={'regular'}
          textAlign="center"
          mb={4}
        >
          Stay up to date with <HighlightSpan>best practices</HighlightSpan> in
          LLM development
        </Typography>
        <Container maxWidth="md">
          <SignupForNewsletter />
        </Container>
      </Box>
      <Box />
    </>
  );
};

const LearnMore: React.FC = () => {
  return (
    <SectionLayout
      disableGutter
      alignTitle={'center'}
      title="Take your Application from Prototype to Production with Palico"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CTA />
      </Box>
    </SectionLayout>
  );
};

export default LearnMore;
