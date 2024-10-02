'use client';

import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import DeployIcon from '@mui/icons-material/Storage';
import BenchmarkIcon from '@mui/icons-material/Equalizer';
import PreviewChangesIcon from '@mui/icons-material/QuestionAnswer';
import TypescriptIcon from './typescript_icon';
import { HighlightSpan } from '../client_fragments';
import { Link } from '@palico-ai/components';
import { DocRoute } from '../../../../utils/route_path';
export interface AttributeCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  link: string;
}

const AttributeItem: React.FC<AttributeCardProps> = ({
  icon,
  label,
  description,
  link,
}) => {
  return (
    <Link href={link} target="_blank">
      <Paper
        sx={(theme) => ({
          height: '100%',
          p: 4,
          boxSizing: 'border-box',
          borderRadius: theme.shape.borderRadius,
          '&:hover': {
            boxShadow: theme.shadows[6],
          },
        })}
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
            <Typography variant="body2" fontSize={17}>
              {description}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Link>
  );
};

const attributes: AttributeCardProps[] = [
  {
    label: 'Build Any Application',
    link: DocRoute.buildingAnApp(),
    icon: <CodeIcon color="info" />,
    description: 'Write your application in code with complete flexibility',
  },
  {
    label: 'Preview Your Changes',
    icon: <PreviewChangesIcon color="info" />,
    description: 'Test your changes instantly with our playground UI',
    link: DocRoute.previewChanges(),
  },
  {
    label: 'Improve Performance',
    icon: <BenchmarkIcon color="info" />,
    description: 'Run experiments and iterate on performance',
    link: DocRoute.docsExperiment(),
  },
  {
    label: 'Logs and Traces',
    icon: <BugReportIcon color="info" />,
    description: 'Look under-the-hood of any request with open-telemetry',
    link: DocRoute.logsAndTracing(),
  },
  {
    label: 'REST API & SDK',
    icon: <DeployIcon color="info" />,
    description: 'Deploy your application behind a REST API with Docker',
    link: DocRoute.clientSdk(),
  },
  {
    label: 'Typescript',
    icon: <TypescriptIcon color="info" />,
    description: 'Build a production-ready codebase with type-safety',
    link: DocRoute.quickStart(),
  },
];

const ApplicationAttributes = () => {
  return (
    <Grid container spacing={4} mt={8}>
      {attributes.map((attribute, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <AttributeItem {...attribute} />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          fontSize={20}
          display={'block'}
          textAlign={'right'}
        >
          Stay In Flow With An{' '}
          <HighlightSpan>Integrated Tech Stack</HighlightSpan>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ApplicationAttributes;
