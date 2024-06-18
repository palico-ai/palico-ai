import React from 'react';
import HowItWorksStepWithMedia from './side_by_side_layout';
import { Box } from '@mui/material';

const CompareAndAnalyze: React.FC = () => {
  return (
    <Box>
      <HowItWorksStepWithMedia
        maxHeight={400}
        title="Compare and analyze results from different experiments"
        descriptions={[
          'Review the results of your experiments',
          'Use our tracing tool to look under-the-hood for how each test-case was executed.',
          'Export test results to Jupyter notebook for more powerful analytics.',
        ]}
        embedURL="https://www.loom.com/embed/ba22e22dbd1a4540bc4cbea094c64237?sid=d43faa1a-834e-498e-9d1e-d9fa5e79bbfe"
      />
    </Box>
  );
};

export default CompareAndAnalyze;
