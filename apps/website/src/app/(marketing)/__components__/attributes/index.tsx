'use client';

import { Box, Grid, Paper, styled, Typography } from '@mui/material';
import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import ExperimentIcon from '@mui/icons-material/Science';
import OpenSourceIcon from '@mui/icons-material/GitHub';
import SectionLayout from '../section_layout';
import DeployIcon from '@mui/icons-material/Storage';
import BenchmarkIcon from '@mui/icons-material/Equalizer';

export interface AttributeCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
}

const AttributeItem: React.FC<AttributeCardProps> = ({
  icon,
  label,
  description,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        height: '100%',
        p: 4,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        {icon}
        <Box>
          <Typography variant="h5" gutterBottom>
            {label}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.7,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const attributes: AttributeCardProps[] = [
  {
    label: 'Build your Application',
    icon: <CodeIcon color="success" />,
    description:
      'Build any LLM application in Typescript with a simple and flexible interface',
  },
  {
    label: 'Benchmark your Performance',
    icon: <BenchmarkIcon color="secondary" />,
    description:
      'Create unit-tests that defines the expectation of your LLM application',
  },
  {
    label: 'Run Experiments',
    icon: <ExperimentIcon color="info" />,
    description:
      'Test different permutation of your app and compare the results',
  },
  {
    label: 'Deep-dive with Traces',
    icon: <BugReportIcon color="warning" />,
    description:
      'Debug performance issues by reviewing runtime traces of your application',
  },
  {
    label: 'Deploy Anywhere',
    icon: <DeployIcon color="success" />,
    description:
      'Compile your application as docker containers and deploy it anywhere',
  },
  {
    label: 'Open Source',
    icon: <OpenSourceIcon />,
    description: 'Build alongside a growing community ♥️',
  },
];

const Highlight = styled('span')(({ theme }) => ({
  textDecoration: 'underline',
  textUnderlineOffset: '5px',
  textDecorationThickness: '2px',
  textDecorationColor: theme.palette.primary.main,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
  },
}));

const ApplicationAttributes = () => {
  return (
    <SectionLayout title="Palico is a Framework for Raidly Iterating on your LLM Application">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" align="left">
            Palico provides a <Highlight>flexible</Highlight> and{' '}
            <Highlight>integrated</Highlight> experience for{' '}
            <Highlight>building</Highlight>,{' '}
            <Highlight>experimenting</Highlight>, and{' '}
            <Highlight>deploying</Highlight> your LLM applications
          </Typography>
        </Grid>
        {attributes.map((attribute, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <AttributeItem {...attribute} />
          </Grid>
        ))}
      </Grid>
    </SectionLayout>
  );
};

export default ApplicationAttributes;
