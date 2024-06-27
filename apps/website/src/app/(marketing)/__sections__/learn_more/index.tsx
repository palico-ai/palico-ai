'use client';

import React from 'react';
import SectionLayout from '../section_layout';
import { Button, Link, Typography } from '@palico-ai/components';
import { Box, Container } from '@mui/material';
import RoutePath from '../../../../utils/route_path';
import SignupForNewsletter from './newsletter';

const LearnMore: React.FC = () => {
  return (
    <SectionLayout
      title="Build Accurate LLM Applications with Experiment-Driven Development"
      disableGutter
      alignTitle={'center'}
    >
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
        <Link href={RoutePath.quickStart()}>
          <Button variant="contained" color="primary" size="large" fullWidth>
            Get started in 5 minutes
          </Button>
        </Link>
        <Link href={RoutePath.scheduleDemo()} target="_blank">
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
        <Typography variant="subtitle1" textAlign="center" mb={4}>
          Subscribe to our newsletter to get the latest updates on Palico AI
        </Typography>
        <Container maxWidth="md">
          <SignupForNewsletter />
        </Container>
      </Box>
      <Box />
    </SectionLayout>
  );
};

export default LearnMore;
