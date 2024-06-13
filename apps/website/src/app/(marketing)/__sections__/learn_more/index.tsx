'use client';

import React from 'react';
import SectionLayout from '../section_layout';
import { Button, Link, Typography } from '@palico-ai/components';
import { Box, Divider, Grid, Paper } from '@mui/material';

export interface LearnMoreItemProps {
  label: string;
  description: string;
  href: string;
}

const LearnMoreItem: React.FC<LearnMoreItemProps> = ({
  label,
  description,
  href,
}) => {
  return (
    <Link href={href}>
      <Paper sx={{ p: 2, width: '100%', boxSizing: 'border-box' }}>
        <Typography variant="h6">{label}</Typography>
        <Typography variant="subtitle2">{description}</Typography>
      </Paper>
    </Link>
  );
};

const LearnMore: React.FC = () => {
  return (
    <SectionLayout
      title="Build Confidence with Data-Driven Decisions"
      disableGutter
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button variant="contained" color="primary" size="large">
          Get started in 5 minutes
        </Button>
        <Button variant="contained" color="secondary" size="large">
          Schedule a demo
        </Button>
      </Box>
      {/* <Divider
        sx={{
          my: 8,
        }}
      />
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            <LearnMoreItem
              label="Docs"
              description="Learn how to use Palico AI"
              href="/docs"
            />
            <LearnMoreItem
              label="Build API Reference"
              description="Learn how to use Palico AI"
              href="/docs"
            />
            <LearnMoreItem
              label="Evaluate your Agent"
              description="Learn how to use Palico AI"
              href="/docs"
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          sx={{
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              paddingBottom: '62.48534583821805%',
              height: 0,
            }}
          >
            <iframe
              src={
                'https://www.loom.com/embed/d578ca2a63e4461da469e3d8a6df74b5?sid=d1caf7e9-9a79-4dd6-95b8-428044a32420'
              }
              frameBorder="0"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </Grid>
      </Grid> */}
    </SectionLayout>
  );
};

export default LearnMore;
