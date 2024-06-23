import { Box, CardContent, CardHeader, Grid } from '@mui/material';
import { Button, Link, Typography } from '@palico-ai/components';
import React from 'react';
import { ComponentCard as Card, ComponentCardWithDescription } from './shared';
import DevImage from '../../../../../public/landing_page/dev.png';
import PrototypeImage from '../../../../../public/landing_page/prototype.png';
import ExpImage from '../../../../../public/landing_page/experiment.png';
import Image from 'next/image';
import RoutePath from '../../../../utils/route_path';

const LEARN_MORE_TEXT = 'Docs';

export const LLMDevelopmentFramework: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title={'LLM Development'}
        action={
          <Link href={RoutePath.docsConcepts()}>
            <Button variant="outlined" color="secondary" size="small">
              {LEARN_MORE_TEXT}
            </Button>
          </Link>
        }
      />
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
            Build a modular prompt-layer that lets you easily swap different
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
      action={{
        label: LEARN_MORE_TEXT,
        link: RoutePath.docsWorkflow(),
      }}
      descriptions={[
        'Model complex operations including multiple LLM Agents and business logics into a single workflow',
      ]}
    />
  );
};

export const Observability: React.FC = () => {
  return (
    <ComponentCardWithDescription
      action={{
        label: LEARN_MORE_TEXT,
        link: RoutePath.docsTracing(),
      }}
      title={'Observability'}
      descriptions={[
        'Add custom tracing using OpenTelemetry. Sync your traces with your existing observability tools like Datadog, New Relic, and more.',
      ]}
    />
  );
};

export const APIAndSDK: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'API & SDK'}
      action={{
        label: LEARN_MORE_TEXT,
        link: RoutePath.docsClientSDK(),
      }}
      descriptions={[
        'Your LLM Agents and Workflows are automatically deployed as a RESTful API and can be accessed using our Javascript SDK',
      ]}
    />
  );
};

export const Experimentation: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title={'Experimentation'}
        action={
          <Link href={RoutePath.docsExperimentation()}>
            <Button variant="outlined" color="secondary" size="small">
              {LEARN_MORE_TEXT}
            </Button>
          </Link>
        }
      />
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
          Run, manage, and analyze experiments that tests different models,
          prompts, business logics, and any other components of your LLM
          application
        </Typography>
      </CardContent>
    </Card>
  );
};

export const Evaluation: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'Evaluation'}
      action={{
        label: LEARN_MORE_TEXT,
        link: RoutePath.docsEvaluation(),
      }}
      descriptions={[
        'Unit-test the accuracy of your LLM Agents using our pre-built metrics, or define your own custom metrics',
      ]}
    />
  );
};

export const Analysis: React.FC = () => {
  return (
    <ComponentCardWithDescription
      title={'Analysis'}
      action={{
        label: LEARN_MORE_TEXT,
        link: RoutePath.docsExperimentAnalysis(),
      }}
      descriptions={[
        'Deep-dive into test results for your LLM Agents directly within Palico Studio',
        'Create reports comparing multiple test-cases and their aggregated results',
        'Export test results to Jupiter Notebook for more in-depth analysis',
      ]}
    />
  );
};

export const VersionControl: React.FC = () => {
  return (
    <ComponentCardWithDescription
      action={{
        label: LEARN_MORE_TEXT,
        link: RoutePath.docsVersioning(),
      }}
      title={'Version Control'}
      descriptions={[
        'All experiments are automatically version-controlled alongside your code',
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
            <Link href={RoutePath.docsStudios()}>
              <Button variant="outlined" color="secondary" size="small">
                {LEARN_MORE_TEXT}
              </Button>
            </Link>
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
