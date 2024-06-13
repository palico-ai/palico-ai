import React from 'react';
import HowItWorksStep from './side_by_side_layout';
import { LandingPageData } from '../../data';

const CreateExperiments: React.FC = () => {
  return (
    <HowItWorksStep
      maxHeight={300}
      title={LandingPageData.howItWorks.step.runExperiments.title}
      descriptions={LandingPageData.howItWorks.step.runExperiments.descriptions}
      embedURL={LandingPageData.howItWorks.step.runExperiments.demoUrl}
    />
  );
};

export default CreateExperiments;
