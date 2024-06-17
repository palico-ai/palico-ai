import React from 'react';
import HowItWorksStepWithMedia from './side_by_side_layout';
import { LandingPageData } from '../../data';

const CreateExperiments: React.FC = () => {
  return (
    <HowItWorksStepWithMedia
      maxHeight={300}
      title={'Scale your Experimentation'}
      descriptions={[
        "Use Palico Studio to run experiments that tests how independent variables (prompt, model, business logic, etc) affect your agent's performance",
      ]}
      embedURL={LandingPageData.howItWorks.step.runExperiments.demoUrl}
    />
  );
};

export default CreateExperiments;
