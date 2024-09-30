'use client';

import React from 'react';
import { useInterval } from 'usehooks-ts';
import SectionLayout from '../section_layout';
import { Box, Grid, Paper } from '@mui/material';
import { HighlightSpan, LearnMoreButton } from '../client_fragments';
import RoutePath from '../../../../utils/route_path';
import Image from 'next/image';
import HotswapImage from './hotswap.svg';
import { Typography } from '@palico-ai/components';

const AppConfigHotSwap: React.FC = () => {
  return (
    <SectionLayout
      title="Hot-swap Models, Prompts, Anything and Everything"
      disableTitleGutter
    >
      <Grid container spacing={6} mt={6}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" fontSize={20}>
            Build an{' '}
            <HighlightSpan>interchangable application layer</HighlightSpan>{' '}
            where you can swap out any components at runtime without changing
            any code
          </Typography>
          <Box
            sx={{
              display: 'flex',
              mt: 2,
            }}
          >
            <LearnMoreButton href={RoutePath.docsAppConfig()} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper
            sx={(theme) => ({
              p: 4,
              borderRadius: theme.shape.borderRadius,
              display: 'flex',
              justifyContent: 'center',
              '&:hover': {
                boxShadow: theme.shadows[6],
              },
            })}
          >
            <Image
              src={HotswapImage}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                boxSizing: 'border-box',
              }}
              width={703}
              height={811}
              alt="Hotswap Flow Diagram"
            />
          </Paper>
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default AppConfigHotSwap;
