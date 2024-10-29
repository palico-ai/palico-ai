'use client';

import React, { useEffect, useMemo } from 'react';
import {
  ComponentWithChildren,
  ErrorMessage,
  Skeleton,
} from '@palico-ai/components';
import { useQuery } from '@tanstack/react-query';
import { getLabView } from '../../../../../services/studio';
import {
  GET_ALL_AGENTS,
  GET_QUICK_LAB,
} from '../../../../../constants/query_keys';
import { getAllAgents } from '../../../../../services/metadata';
import { Box, Grid } from '@mui/material';
import { LabCanvasContextProvider } from './canvas.context';
import PageContent from '../../../../../components/layout/page_content';
import Breadcrumb from '../../../../../utils/breadcrumb';
import QuicklabTopbarNav from './topbar_menu';

export interface LabProviderProps extends ComponentWithChildren {
  labId: string;
}

export const LabApplicationProvider: React.FC<LabProviderProps> = ({
  children,
  labId,
}) => {
  const {
    data: labData,
    isPending: isPendingLab,
    error: labDataError,
  } = useQuery({
    queryKey: [GET_QUICK_LAB, labId],
    queryFn: async () => {
      const labData = await getLabView(labId);
      return labData;
    },
  });
  const {
    data: agents,
    isPending: agentsPending,
    error: agentsError,
  } = useQuery({
    queryKey: [GET_ALL_AGENTS],
    queryFn: async () => {
      const response = await getAllAgents();
      return response;
    },
  });

  useEffect(() => {
    console.log('labData updated', labData);
  }, [labData]);

  const isPending = useMemo(
    () => isPendingLab || agentsPending,
    [isPendingLab, agentsPending]
  );

  const error = useMemo(
    () => labDataError || agentsError,
    [labDataError, agentsError]
  );

  if (error) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ErrorMessage message={error?.message || 'Something went wrong'} />
      </Box>
    );
  }

  if (isPending || !labData || !agents) {
    console.log('loading');
    return (
      <Box
        sx={{
          py: 2,
          px: 2,
          boxSizing: 'border-box',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" count={1} height={60} />
          </Grid>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Skeleton variant="rectangular" height={200} count={3} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <LabCanvasContextProvider
      agentIdList={agents.map((agent) => agent.name)}
      initialExperiments={labData.experiments ?? []}
      initialTestCases={labData.testCases ?? []}
      initialExperimentTestResults={labData.experimentTestResults ?? {}}
      initialBaselinedExperimentId={labData.baselineExperimentId}
    >
      <PageContent
        breadcrumb={[
          Breadcrumb.quickLab({ includeHref: true }),
          Breadcrumb.quickLabItem({ labName: labId }),
        ]}
        actions={<QuicklabTopbarNav currentLab={labData} />}
      >
        {children}
      </PageContent>
    </LabCanvasContextProvider>
  );
};
