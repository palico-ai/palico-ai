import React from 'react';
import DefineYourApplication from './define';
import UnitestAccuracySection from './unitest';
import CreateExperiments from './experiments';
import CompareAndAnalyze from './compare';
import DebugAndTrace from './debug';
import SectionLayout from '../section_layout';

const HowItWorks: React.FC = () => {
  return (
    <SectionLayout title="Designing an Experiment-Driven Application">
      <DefineYourApplication />
      <UnitestAccuracySection />
      <CreateExperiments />
      <CompareAndAnalyze />
      <DebugAndTrace />
    </SectionLayout>
  );
};

export default HowItWorks;
