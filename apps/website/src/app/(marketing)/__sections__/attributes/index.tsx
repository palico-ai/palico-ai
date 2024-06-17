import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import MoveFastIcon from '@mui/icons-material/FastForward';
import BugReportIcon from '@mui/icons-material/BugReport';
import ExperimentIcon from '@mui/icons-material/Science';
import AnalyzeIcon from '@mui/icons-material/Equalizer';
import OpenSourceIcon from '@mui/icons-material/GitHub';
import SectionLayout from '../section_layout';

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
        <Typography variant="h5" gutterBottom>
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.5,
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

const attributes: AttributeCardProps[] = [
  {
    label: 'Build with Typescript',
    icon: <CodeIcon fontSize="medium" />,
    description:
      'Build production-ready LLM applications with your team in Typescript',
  },
  {
    label: 'Experiment at Scale',
    icon: <ExperimentIcon />,
    description:
      'Run hundreds of tests across every component of your LLM application to find the best fit for your use case',
  },
  {
    label: 'Debug and Tracing',
    icon: <BugReportIcon />,
    description:
      'Palico comes with out-of-the-box tracing and lets you add any custom traces of your own',
  },
  {
    label: 'E2E Development',
    icon: <MoveFastIcon />,
    description:
      'Build your LLM application with maximum flexibility and Palico will handle the REST (api & deployment)',
  },
  {
    label: 'REST API and SDK',
    icon: <AnalyzeIcon />,
    description:
      'Compare different tests with each other with our visualization tools, or import test results into Jupyter notebook to create powerful analysis',
  },
  {
    label: 'Open Source',
    icon: <OpenSourceIcon />,
    description: 'Build alongside a growing community ♥️',
  },
];

const ApplicationAttributes = () => {
  return (
    <SectionLayout>
      <Grid container spacing={4}>
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
