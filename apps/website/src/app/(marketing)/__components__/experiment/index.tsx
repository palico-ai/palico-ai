import React from 'react';
import SectionLayout from '../section_layout';
import BenchmarkAccuracySubSection from './experiment_sections/benchmark_accuracy';
import { ExperimentDemoVideoURL } from '../constants';
import { Grid } from '@mui/material';
import { ContentWithMedia, HowItWorksTextStep } from '../layouts';

const CreateExperiments: React.FC = () => {
  return (
    <ContentWithMedia
      title={'Run Experiments'}
      descriptions={[
        'Tests how different variables (prompt, model, business logic, etc) affect your application performance at scale and find the most effective combination',
        'Review, compare, and analyze the results of your experiments from your dashboard, or export them to Jupyter notebook for more powerful analysis',
      ]}
      embedURL={ExperimentDemoVideoURL}
    />
  );
};

const ExperimentSection: React.FC = () => {
  return (
    <SectionLayout
      title="Experiment | Build, Measure, Learn, and Iterate"
      alignTitle={'left'}
    >
      <BenchmarkAccuracySubSection />
      <CreateExperiments />
      <Grid container spacing={12}>
        <Grid item md={6} sm={12} xs={12}>
          <HowItWorksTextStep
            title="Debug Performance Issues with Traces"
            descriptions={[
              'Look under-the-hood of each request of your application with our provided traces, or add your own custom traces to debug issues faster',
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
