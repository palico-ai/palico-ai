import React from 'react';
import HowItWorksStepWithMedia from './side_by_side_layout';
import { LandingPageData } from '../../data';

const CreateExperiments: React.FC = () => {
  return (
    <HowItWorksStepWithMedia
      maxHeight={300}
      title={'Scale your experimentation'}
      descriptions={[
        'Tests how independent variables (prompt, model, business logic, etc) affect your agent’s performance at scale. Find and implement the most effective permutation.',
        'Review, compare, and analyze the results of your experiments from your dashboard, or export them to Jupyter notebook for more powerful analytics.',
        'Use our tracing tool to look under-the-hood for how every run was executed.',
      ]}
      embedURL={LandingPageData.howItWorks.step.runExperiments.demoUrl}
    />
  );
};

export default CreateExperiments;
