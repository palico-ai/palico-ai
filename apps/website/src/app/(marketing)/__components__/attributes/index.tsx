'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import SectionLayout from '../section_layout';
import DeployIcon from '@mui/icons-material/Storage';
import BenchmarkIcon from '@mui/icons-material/Equalizer';
import PreviewChangesIcon from '@mui/icons-material/QuestionAnswer';
import TypescriptIcon from './typescript_icon';
import { HighlightSpan } from '../client_fragments';
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
            variant="body2"
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
    icon: <CodeIcon color="info" />,
    description: 'Build any application in code with complete flexibility',
  },
  {
    label: 'Preview Your Changes',
    icon: <PreviewChangesIcon color="info" />,
    description: 'Test your changes locally with our playground UI',
  },
  {
    label: 'Improve Performance',
    icon: <BenchmarkIcon color="info" />,
    description: 'Iteratively performance with our experimentation tools',
  },
  {
    label: 'Debug with Tracing',
    icon: <BugReportIcon color="info" />,
    description: 'Look under-the-hood of any request with open-telemetry',
  },
  {
    label: 'Deploy Anywhere',
    icon: <DeployIcon color="info" />,
    description: 'Deploy your application with docker to any cloud provider',
  },
  {
    label: 'Typescript',
    icon: <TypescriptIcon color="info" />,
    description: 'Build a production-ready codebase with type-safety',
  },
];

const ApplicationAttributes = () => {
  return (
    <SectionLayout
      title="Stay In Flow With An Integrated Tech Stack"
      subtitle={
        <>
          Start your project with a set of{' '}
          <HighlightSpan>integrated components</HighlightSpan> for building,
          experimenting, and deploying your application
        </>
      }
      disableTitleGutter
    >
      <Grid container spacing={4} mt={2}>
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
