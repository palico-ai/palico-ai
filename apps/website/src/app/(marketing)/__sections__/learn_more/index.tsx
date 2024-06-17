'use client';

import React from 'react';
import SectionLayout from '../section_layout';
import { Button, Link } from '@palico-ai/components';
import { Box } from '@mui/material';
import RoutePath from '../../../../utils/route_path';

const LearnMore: React.FC = () => {
  return (
    <SectionLayout
      title="Improve Accuracy with Experiment-Driven Development"
      disableGutter
      alignTitle={'center'}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Link href={RoutePath.docs()}>
          <Button variant="contained" color="primary" size="large">
            Get started in 5 minutes
          </Button>
        </Link>
        <Link href={RoutePath.scheduleDemo()} target="_blank">
          <Button variant="contained" color="secondary" size="large">
            Schedule a demo
          </Button>
        </Link>
      </Box>
    </SectionLayout>
  );
};

export default LearnMore;
