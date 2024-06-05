import React from 'react';
import HowItWorksStep from './side_by_side_layout';

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
    <HowItWorksStep
      maxHeight={300}
      title="Write Unit-test for Accuracy"
      descriptions={[
        'Using our evaluation library, write a test for every use-case your agent needs to support',
        'Measure the accuracy of your agents with our pre-built metrics, or create your own',
      ]}
      codeSnippet={codeSnippet}
    />
  );
};

export default UnitestAccuracySection;
