import React from 'react';
import PageContent from '../../components/layout/page_content';
import AgentFeatureTestGrid from './__components__/grid';
import { Box, Button, TextField } from '@mui/material';

const ComparatorPage: React.FC = () => {
  return (
    <PageContent
      topbarRightNavs={
        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <Button variant="contained" color="info">
            Save
          </Button>
          <TextField
            sx={{
              minWidth: 200,
            }}
            size="small"
            variant="outlined"
            select
            label="Select View"
          />
          <Button variant="contained" color="secondary">
            Create New View
          </Button>
        </Box>
      }
    >
      <AgentFeatureTestGrid />
    </PageContent>
  );
};

export default ComparatorPage;
