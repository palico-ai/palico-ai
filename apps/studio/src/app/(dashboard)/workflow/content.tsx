'use client';

import { ErrorMessage, Skeleton } from '@palico-ai/components';
import { useQuery } from '@tanstack/react-query';
import { getAllWorkflows } from '../../../services/workflows';
import React from 'react';
import { Box, Paper } from '@mui/material';
import WorkflowListTable from './table';
import { WORKFLOWS_QUERY_KEY } from '../../../constants/query_keys';

const WorkflowPageContent: React.FC = () => {
  const {
    data: workflows,
    isPending,
    error,
  } = useQuery({
    queryKey: [WORKFLOWS_QUERY_KEY],
    queryFn: async () => {
      const response = await getAllWorkflows();
      return response.map((item) => ({ name: item.name }));
    },
  });

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isPending || !workflows) {
    return (
      <Box
        sx={{
          height: '20vh',
        }}
      >
        <Skeleton count={5} />
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 2,
      }}
    >
      <WorkflowListTable workflows={workflows} />
    </Paper>
  );
};

export default WorkflowPageContent;
