import { Box } from '@mui/material';
import { Button } from '@palico-ai/components';
import React from 'react';

const PageHeaderAction: React.FC = () => {
  return (
    <Box>
      <Button variant="contained" color="primary" size="small">
        New Dataframe
      </Button>
    </Box>
  );
};

export default PageHeaderAction;
