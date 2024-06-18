import React from 'react';
import DefineYourApplication from './define';
import UnitestAccuracySection from './unitest';
import CreateExperiments from './experiments';
import CompareAndAnalyze from './compare';
import SectionLayout from '../section_layout';
import { HowItWorksTextStep } from './side_by_side_layout';
import { Grid } from '@mui/material';

const HowItWorks: React.FC = () => {
  return (
    <SectionLayout
      title="Building an Experiment-Driven Application"
      alignTitle={'center'}
    >
      <DefineYourApplication />
      <UnitestAccuracySection />
      <CreateExperiments />
      <CompareAndAnalyze />
      <Grid container spacing={12}>
        <Grid item md={6} sm={12} xs={12}>
          <HowItWorksTextStep
            title="Collaborate with your Team"
            descriptions={[
              'All your changes and experiments are automatically version-controlled alongside your code, allowing anyone in your team to review experiments independently',
            ]}
          />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <HowItWorksTextStep
            title="Deploy to Production"
            descriptions={[
              'Your LLM Agents and Workflows are automatically deployed behind a REST API using JWT token authorization. Use Palico SDK to communicate with your Agent from your other services',
            ]}
          />
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default HowItWorks;
