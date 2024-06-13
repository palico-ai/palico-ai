import { Box, CardContent, CardHeader, CardMedia, Grid } from '@mui/material';
import { Button, Typography } from '@palico-ai/components';
import React from 'react';
import {
  ComponentCard as Card,
  ComponentCardWithDescription,
  ComponentCardWithDescriptionAndImage,
} from './shared';

export const LLMDevelopmentFramework: React.FC = () => {
  return (
    <ComponentCardWithDescriptionAndImage
      title={'LLM Development'}
      descriptions={[
        'Build a modular prompt-layer, allowing you to easily swap different components in and out and view its impact on your models performance.',
      ]}
      image={'https://picsum.photos/200/300'}
    />
  );
};

export const Workflows: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'Workflows'}
      descriptions={[
        'Define your own workflows using our visual editor',
        'Run your workflows in parallel',
        'Monitor your workflows in real-time',
      ]}
    />
  );
};

export const APIAndSDK: React.FC = () => {
  return (
    <Card>
      <CardHeader title={'API & SDK'} />
      <CardContent>
        <Typography variant="body2">
          Your LLM Agents and Workflows are automatically deployed as a RESTful
          API and can be accessed using our Javascript SDK.
        </Typography>
      </CardContent>
    </Card>
  );
};

export const Observability: React.FC = () => {
  return (
    <Card>
      <CardHeader title={'Logs and Traces'} />
      <CardContent>
        <Typography variant="body2">
          Get tracing out of the box and look under the hood of your LLM Agents
        </Typography>
        <Typography variant="body2">
          Add your own Custom Tracing using OpenTelemetry
        </Typography>
      </CardContent>
    </Card>
  );
};

export const Experimentation: React.FC = () => {
  return (
    <ComponentCardWithDescriptionAndImage
      title={'Experimentation'}
      descriptions={[
        'Run, track, analyze, and collaborate at scale with your experiments',
      ]}
      image={'https://picsum.photos/200/300'}
    />
  );
};

export const Evaluation: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'Evaluation'}
      descriptions={[
        'Evaluate the performance of your LLM Agent using our evaluation tools',
      ]}
    />
  );
};

export const Analysis: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'Analysis'}
      descriptions={[
        'Analyze the performance of your LLM Agent using our analysis tools',
      ]}
    />
  );
};

export const VersionControl: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'Version Control'}
      descriptions={[
        'Automatically version control your experiments alongside your code',
      ]}
    />
  );
};

export const Prototype: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <CardHeader sx={{ px: 0 }} title={'Prototype'} />
            <Typography variant="body2">
              Prototype and iterate quickly
            </Typography>
            <Typography variant="body2">
              Prototype and iterate quickly
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <CardMedia
              component="img"
              sx={{ width: '100%', maxHeight: 300 }}
              image={'https://picsum.photos/200/300'}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
