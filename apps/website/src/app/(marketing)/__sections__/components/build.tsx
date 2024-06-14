import { Box, CardContent, CardHeader, Grid } from '@mui/material';
import { Typography } from '@palico-ai/components';
import React from 'react';
import { ComponentCard as Card, ComponentCardWithDescription } from './shared';
import DevImage from '../../../../../public/landing_page/dev.png';
import PrototypeImage from '../../../../../public/landing_page/prototype.png';
import ExpImage from '../../../../../public/landing_page/experiment.png';
import Image from 'next/image';

export const LLMDevelopmentFramework: React.FC = () => {
  return (
    <Card>
      <CardHeader title={'LLM Development'} />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
          }}
        >
          <Box>
            <Image
              style={{
                width: '100%',
                color: 'white',
                objectFit: 'contain',
              }}
              src={DevImage}
              alt="OpenAI"
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2">
            Build a modular prompt-layer, allowing you to easily swap different
            components in and out and view its impact on your models
            performance.
          </Typography>
          <Typography variant="body2">
            Development production-level application using Typescript
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export const Workflows: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'Workflows'}
      descriptions={[
        'Model complex operations including multiple LLM Agents and business logics into a single workflow',
      ]}
    />
  );
};

export const Observability: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'Observability'}
      descriptions={[
        'Add custom tracing using OpenTelemetry. Sync your traces with your existing observability tools like Datadog, New Relic, and more.',
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

export const Experimentation: React.FC = () => {
  return (
    <Card>
      <CardHeader title={'Experimentation'} />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Image
          src={ExpImage}
          alt="Experimentation"
          style={{
            width: '100%',
            objectFit: 'contain',
          }}
        />
        <Typography variant="body2" gutterBottom>
          Test different models, prompts, business logics, and any other
          components of your LLM application
        </Typography>
      </CardContent>
    </Card>
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
            md={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <CardHeader sx={{ px: 0 }} title={'Prototype'} />
            <Typography variant="body2">
              Chat with your Agent without writing any extra code using Palico
              Studio
            </Typography>
            <Typography variant="body2">
              Compare responses side-by-side with different feature-flags
            </Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <Image
              style={{
                width: '100%',
                objectFit: 'contain',
              }}
              src={PrototypeImage}
              alt="Prototype"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
