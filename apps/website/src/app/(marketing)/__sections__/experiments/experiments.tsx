import React from 'react';
import { HowItWorksStepWithMedia } from '../__components__/layouts';
import { LandingPageData } from '../../data';

const CreateExperiments: React.FC = () => {
  return (
    <HowItWorksStepWithMedia
      title={'Run Experiments'}
      descriptions={[
        'Tests how independent variables (prompt, model, business logic, etc) affect your agent’s performance at scale. Find and implement the most effective permutation.',
        'Review, compare, and analyze the results of your experiments from your dashboard, or export them to Jupyter notebook for more powerful analysis.',
        'Use our tracing tool to look under-the-hood for how every test-case was executed.',
      ]}
      embedURL={LandingPageData.howItWorks.step.runExperiments.demoUrl}
    />
  );
};

export default CreateExperiments;
