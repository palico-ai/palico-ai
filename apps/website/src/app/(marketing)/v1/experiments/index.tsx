import React from 'react';
import DefineYourApplication from './build_your_app';
import BenchmarkAccuracySubSection from '../../__shared__/experiment_sections/benchmark_accuracy';
import CreateExperiments from './experiments';
import SectionLayout from '../../__shared__/section_layout';
import { HowItWorksTextStep } from '../../__shared__/layouts';
import { Grid } from '@mui/material';

const HowItWorks: React.FC = () => {
  return (
    <SectionLayout
      title="Improve Accuracy with Experiment-Driven Development"
      alignTitle={'left'}
    >
      <DefineYourApplication />
      <BenchmarkAccuracySubSection />
      <CreateExperiments />
      <Grid container spacing={12}>
        <Grid item md={6} sm={12} xs={12}>
          <HowItWorksTextStep
            title="Collaborate with your Team"
            descriptions={[
              'All your changes and experiments are automatically version-controlled alongside your code, allowing anyone in your team to review or run experiments independently',
            ]}
          />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <HowItWorksTextStep
            title="Deploy to Production"
            descriptions={[
              'Your LLM applications are automatically deployed behind a REST API. Use Palico SDK to communicate with your Agent from your other services',
            ]}
          />
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default HowItWorks;
