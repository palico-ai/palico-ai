'use client';

import React from 'react';
import SectionLayout from '../section_layout';
import { Button, Link, Typography } from '@palico-ai/components';
import { Box, Container, Divider, Grid } from '@mui/material';
import RoutePath from '../../../../utils/route_path';
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
        <Link href={RoutePath.quickStart()}>
          <Button variant="contained" color="primary" size="large" fullWidth>
            Get Started in 5 minutes
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
    </>
  );
};

const BenefitList = [
  'Build complex LLM applications with flexible and dynamic prompts',
  'Measure how each component of your LLM stack (model, prompt, rag, etc) affects performance',
  'Find the right input combination for best results through Rapid Experimentation',
  'Debug performance issues with analysis tools and tracing',
  'Deploy your applications with docker and connect via REST API or SDK',
];

const BenefitsOfPalico: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        gap: 3,
      }}
    >
      {BenefitList.map((benefit, index) => (
        <Box key={index}>
          <Typography variant="subtitle2" mb={3}>
            {benefit}
          </Typography>
          {index !== BenefitList.length - 1 && <Divider variant="fullWidth" />}
        </Box>
      ))}
    </Box>
  );
};

const LearnMore: React.FC = () => {
  return (
    <SectionLayout
      disableGutter
      alignTitle={'center'}
      title="Take your Application from Prototype to Production with Palico"
    >
      <Grid container spacing={12}>
        <Grid item xs={12} sm={12} md={6}>
          <BenefitsOfPalico />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <CTA />
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default LearnMore;
