import React from 'react';
import SectionLayout from '../section_layout';
import { Typography } from '@mui/material';

const WhatIsPalico: React.FC = () => {
  return (
    <SectionLayout title="What is Palico?" alignTitle={'center'}>
      <Typography variant="h4" gutterBottom>
        Palico is a platform that helps you build accurate LLM applications
      </Typography>
    </SectionLayout>
  );
};

export default WhatIsPalico;
