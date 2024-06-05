import React from 'react';
import HowItWorksStep from './side_by_side_layout';
import { Box } from '@mui/material';

const CompareAndAnalyze: React.FC = () => {
  return (
    <Box>
      <HowItWorksStep
        maxHeight={400}
        title="Compare and Analyze Test Results"
        descriptions={[
          'Compare your agents across different experiments and tests with our built-in analysis tool',
          'Export test results to Jupyter notebook for more powerful analytics',
        ]}
        embedURL="https://www.loom.com/embed/d578ca2a63e4461da469e3d8a6df74b5?sid=68b7ebec-2b0c-4c3e-adfb-4f695b765024"
      />
    </Box>
  );
};

export default CompareAndAnalyze;
