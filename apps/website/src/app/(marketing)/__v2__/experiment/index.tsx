import React from 'react';
import SectionLayout from '../../__shared__/section_layout';
import BenchmarkAccuracySubSection from '../../__shared__/experiment_sections/benchmark_accuracy';
import { ContentWithMedia, HowItWorksTextStep } from '../../__shared__/layouts';
import { ExperimentDemoVideoURL } from '../../__shared__/constants';
import { Grid } from '@mui/material';

const CreateExperiments: React.FC = () => {
  return (
    <ContentWithMedia
      title={'Run Experiments'}
      descriptions={[
        'Tests how different variables (prompt, model, business logic, etc) affect your application accuracy at scale and find the most effective combination.',
        'Review, compare, and analyze the results of your experiments from your dashboard, or export them to Jupyter notebook for more powerful analysis.',
      ]}
      embedURL={ExperimentDemoVideoURL}
    />
  );
};

const ExperimentSection: React.FC = () => {
  return (
    <SectionLayout
      title="Improve Accuracy with Iterative Experimentation"
      alignTitle={'left'}
    >
      <BenchmarkAccuracySubSection />
      <CreateExperiments />
      <Grid container spacing={12}>
        <Grid item md={6} sm={12} xs={12}>
          <HowItWorksTextStep
            title="Debug Issues with Traces"
            descriptions={[
              'Look under-the-hood of each request to your LLM application with our ready-made tracing, or add your own custom tracing with OpenTelemetry.',
            ]}
          />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <HowItWorksTextStep
            title="Collaborate with your Team"
            descriptions={[
              'All your changes and experiments are automatically version-controlled alongside your code, allowing anyone in your team to review or run experiments independently',
            ]}
          />
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default ExperimentSection;
