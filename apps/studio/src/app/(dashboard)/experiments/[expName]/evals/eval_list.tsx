'use client';

import {
  CreateEvalJobResponse,
  EvaluationMetadata,
  EvalJobStatus,
} from '@palico-ai/common';
import React, { useEffect } from 'react';
import EvalTable from './table';
import TopbarAction from './page_actions';
import { cloneDeep, size } from 'lodash';
import { useInterval } from 'usehooks-ts';
import { useExperimentName } from '../../../../../hooks/use_params';
import { getEvalStatus } from '../../../../../services/experiments';
import PageContent from '../../../../../components/layout/page_content';
import { Paper } from '@mui/material';
import Breadcrumb from '../../../../../utils/breadcrumb';
import ExperimentSubpageLayout from '../../../../../components/layout/experiment_page_tab';

interface TestListProps {
  initialTests: EvaluationMetadata[];
}

const EvalList: React.FC<TestListProps> = ({ initialTests }) => {
  const [data, setData] = React.useState<EvaluationMetadata[]>(initialTests);
  const [pendingEvals, setPendingEvals] = React.useState<EvaluationMetadata[]>(
    []
  );
  const expName = useExperimentName();

  useInterval(
    async () => {
      if (pendingEvals.length === 0) return;
      let testStatusChanged = false;
      const newTestStatus = await Promise.all(
        pendingEvals.map(async (test) => {
          const response = await getEvalStatus(expName, test.evalName);
          if (response.state !== test.status.state) {
            testStatusChanged = true;
          }
          return response;
        })
      );
      if (!testStatusChanged) return;
      const newPendingTest: EvaluationMetadata[] = cloneDeep(pendingEvals).map(
        (test, index) => {
          return {
            ...test,
            status: newTestStatus[index],
          };
        }
      );
      const pendingTestByName: Record<string, EvaluationMetadata> =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newPendingTest.reduce((acc: any, test) => {
          acc[test.evalName] = test;
          return acc;
        }, {});
      setData((prevData) => {
        const newData = cloneDeep(prevData).map((test) => {
          return pendingTestByName[test.evalName] || test;
        });
        return newData;
      });
      setPendingEvals(
        newPendingTest.filter(
          (test) =>
            test.status.state === EvalJobStatus.ACTIVE ||
            test.status.state === EvalJobStatus.CREATED
        )
      );
    },
    size(pendingEvals) > 0 ? 2500 : null
  );

  useEffect(() => {
    console.log('Data Changed', data);
  }, [data]);

  const handleTestCreated = (response: CreateEvalJobResponse): void => {
    setData((prevData) => [
      cloneDeep(response.evalName),
      ...cloneDeep(prevData),
    ]);
    setPendingEvals((prevTests) => [
      cloneDeep(response.evalName),
      ...prevTests,
    ]);
    // TODO: Monitor the test status
  };

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
      actions={<TopbarAction onEvalCreated={handleTestCreated} />}
    >
      <ExperimentSubpageLayout>
        <Paper sx={{ p: 2 }}>
          <EvalTable data={data} />
        </Paper>
      </ExperimentSubpageLayout>
    </PageContent>
  );
};

export default EvalList;
