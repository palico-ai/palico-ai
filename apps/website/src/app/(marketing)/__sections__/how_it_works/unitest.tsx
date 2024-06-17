import React from 'react';
import HowItWorksStepWithMedia from './side_by_side_layout';

const codeSnippet = `[
  new TestCase()
    .withMessage("")
    .withPayload({})
    .tag()
    .tag()
    .measure(...)
    .measure(...)
    .create(),
  
  new TestCase()
    .withMessage("")
    .withPayload({})
    .tag()
    .tag()
    .measure(...)
    .measure(...)
    .create(),
  ...
]`;

const UnitestAccuracySection: React.FC = () => {
  return (
    <HowItWorksStepWithMedia
      maxHeight={300}
      title="Write Unit-test for Accuracy"
      descriptions={[
        'Define test-cases that models the expected behaviors from your LLM Agent with Palico’s Evaluation library',
        'Measure accuracy with our out-of-the box metrics like Valid JSON Schema, Exact Match, Contains, Friendliness, or create your own',
      ]}
      codeSnippet={codeSnippet}
    />
  );
};

export default UnitestAccuracySection;
