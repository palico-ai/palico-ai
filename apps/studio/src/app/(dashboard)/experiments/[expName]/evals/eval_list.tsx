'use client';

import { JobQueueStatus } from '@palico-ai/common';
import React, { useMemo } from 'react';
import EvalTable from './table';
import TopbarAction from './page_actions';
import { size } from 'lodash';
import { useInterval } from 'usehooks-ts';
import { getEvalsForExperiments } from '../../../../../services/experiments';
import PageContent from '../../../../../components/layout/page_content';
import { Box, Paper } from '@mui/material';
import Breadcrumb from '../../../../../utils/breadcrumb';
import ExperimentSubpageLayout from '../../../../../components/layout/experiment_page_tab';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_EVALS_FOR_EXPERIMENT } from '../../../../../constants/query_keys';
import { ErrorMessage, Skeleton } from '@palico-ai/components';

interface TestListProps {
  expName: string;
}

const EvalList: React.FC<TestListProps> = ({ expName }) => {
  const {
    data: evalList,
    isPending,
    error,
  } = useQuery({
    queryKey: [GET_EVALS_FOR_EXPERIMENT, expName],
    queryFn: async () => {
      return await getEvalsForExperiments(expName);
    },
  });
  const queryClient = useQueryClient();

  const pendingEvals = useMemo(() => {
    return (
      evalList?.filter(
        (test) =>
          test.status.state === JobQueueStatus.ACTIVE ||
          test.status.state === JobQueueStatus.CREATED
      ) || []
    );
  }, [evalList]);

  useInterval(
    async () => {
      await queryClient.invalidateQueries({
        queryKey: [GET_EVALS_FOR_EXPERIMENT, expName],
      });
    },
    size(pendingEvals) > 0 ? 2500 : null
  );

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isPending) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: 2,
          p: 2,
        }}
      >
        <Skeleton count={1} height={60} />
        <Skeleton count={5} height={120} />
      </Box>
    );
  }

  return (
    <PageContent
      disablePadding
      breadcrumb={[
        Breadcrumb.experimentList({ includeHref: true }),
        Breadcrumb.experimentItem({
          experimentName: expName,
          includeHref: true,
        }),
        Breadcrumb.experimentEvalList(),
      ]}
      actions={<TopbarAction experimentName={expName} />}
    >
      <ExperimentSubpageLayout>
        <Paper sx={{ p: 2 }}>
          <EvalTable data={evalList} />
        </Paper>
      </ExperimentSubpageLayout>
    </PageContent>
  );
};

export default EvalList;
