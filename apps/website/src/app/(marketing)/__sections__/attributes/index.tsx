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
      'Our framework lets you build flexible LLM applications in Typescript and automatically deploy it behind an API',
  },
  {
    label: 'Experiment at Scale',
    icon: <ExperimentIcon />,
    description:
      'Write tests for every use-case for your agent and run them on any changes and across every variants of your agents',
  },
  {
    label: 'Debug and Tracing',
    icon: <BugReportIcon />,
    description:
      'We provide out of the box tracing with ability to add your own custom traces with OpenTelemetry',
  },
  {
    label: 'REST API and SDK',
    icon: <AnalyzeIcon />,
    description:
      'Compare different tests with each other with our visualization tools, or import test results into Jupyter notebook to create powerful analysis',
  },
  {
    label: 'Rapid Prototyping',
    icon: <MoveFastIcon />,
    description:
      'Use our Chat Playground to quickly test your agents locally, or setup quick comparisons between different variants of your agents',
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
