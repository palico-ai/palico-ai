'use client';

import { Box, Divider, Grid } from '@mui/material';
import { Button, Link, Typography } from '@palico-ai/components';
import Image from 'next/image';
import React from 'react';
import HeaderImage from '../../../../../public/landing_page/header.png';
import EvidenceBlog from './evidence';
import RoutePath from '../../../../utils/route_path';

const LandingPageHeader: React.FC = () => {
  return (
    <Grid
      container
      sx={{
        py: {
          xs: 8,
          md: 12,
          lg: 16,
          xl: 20,
        },
      }}
      spacing={6}
    >
      <Grid item xs={12} sm={12} md={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 4,
            height: '100%',
            py: 4,
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={(theme) => ({
                color: theme.palette.info.light,
              })}
            >
              LLM Development Is Highly Iterative
            </Typography>
            <Typography variant="body2" fontSize={18}>
              Improving LLM performance (accuracy, latency, cost) requires
              experimenting with{' '}
              <u>
                <i>hundreds of combinations</i>
              </u>{' '}
              of prompt techniques, contexts, models, architectures, and more
            </Typography>
            <Typography
              variant="h2"
              sx={(theme) => ({
                color: theme.palette.primary.light,
              })}
            >
              Streamline Iterative Development
            </Typography>
            <Typography variant="subtitle1">
              Reach production-ready performance in weeks instead of months
            </Typography>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              <Link href={RoutePath.quickStart()}>
                <Button color="primary" variant="contained">
                  Get Started in 5 Minutes
                </Button>
              </Link>
              <Link href={RoutePath.github()}>
                <Button color="info" variant="outlined">
                  Checkout Github Repo
                </Button>
              </Link>
            </Box>
          </Box>
          <EvidenceBlog />
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Image
          src={HeaderImage}
          alt="Header Image"
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 8,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default LandingPageHeader;
