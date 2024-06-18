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
      title="Write unit-tests to evaluate accuracy"
      descriptions={[
        'Define test-cases that model the expected behaviors from your LLM Agent with our evaluation library',
        'Measure accuracy with out-of-the box metrics like Valid JSON Schema, Exact Match, Contains, Friendliness, or define your own.',
      ]}
      codeSnippet={codeSnippet}
    />
  );
};

export default UnitestAccuracySection;
