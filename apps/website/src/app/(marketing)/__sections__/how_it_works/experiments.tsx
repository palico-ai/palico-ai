import React from 'react';
import HowItWorksStep from './side_by_side_layout';

const CreateExperiments: React.FC = () => {
  return (
    <HowItWorksStep
      maxHeight={300}
      title="Run Experiments"
      descriptions={[
        'Take a scientific approach to building your AI models by running and measuring your agents performance under different conditions',
        'Automatically version control your experiments alongside your code',
        'Organize and collaborate on experiments with your team',
      ]}
      embedURL="https://www.loom.com/embed/72d981d967e140c2a8023afd1a21e73f?sid=6102aecf-be83-4e23-bed9-4f57f560c21f"
    />
  );
};

export default CreateExperiments;
