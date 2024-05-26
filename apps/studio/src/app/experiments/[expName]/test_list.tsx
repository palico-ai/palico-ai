'use client';

import {
  CreateExperimentTestJobResponse,
  ExperimentTestMetadata,
  ExperimentTestStatus,
} from '@palico-ai/common';
import React, { useEffect } from 'react';
import { Card, CardContent } from '@palico-ai/components';
import TestTable from './table';
import TestListTableHeader from './header';
import { Divider } from '@mui/material';
import { cloneDeep, size } from 'lodash';
import { useInterval } from 'usehooks-ts';
import { useExperimentName } from '../../../hooks/use_params';
import { getTestStatus } from '../../../services/experiments';

interface TestListProps {
  initialTests: ExperimentTestMetadata[];
}

const TestList: React.FC<TestListProps> = ({ initialTests }) => {
  const [data, setData] =
    React.useState<ExperimentTestMetadata[]>(initialTests);
  const [pendingTests, setPendingTests] = React.useState<
    ExperimentTestMetadata[]
  >([]);
  const expName = useExperimentName();

  useInterval(
    async () => {
      if (pendingTests.length === 0) return;
      let testStatusChanged = false;
      const newTestStatus = await Promise.all(
        pendingTests.map(async (test) => {
          const response = await getTestStatus(expName, test.testName);
          if (response.state !== test.status.state) {
            testStatusChanged = true;
          }
          return response;
        })
      );
      if (!testStatusChanged) return;
      const newPendingTest: ExperimentTestMetadata[] = cloneDeep(
        pendingTests
      ).map((test, index) => {
        return {
          ...test,
          status: newTestStatus[index],
        };
      });
      const pendingTestByName: Record<string, ExperimentTestMetadata> =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newPendingTest.reduce((acc: any, test) => {
          acc[test.testName] = test;
          return acc;
        }, {});
      setData((prevData) => {
        const newData = cloneDeep(prevData).map((test) => {
          return pendingTestByName[test.testName] || test;
        });
        return newData;
      });
      setPendingTests(
        newPendingTest.filter(
          (test) =>
            test.status.state === ExperimentTestStatus.ACTIVE ||
            test.status.state === ExperimentTestStatus.CREATED
        )
      );
    },
    size(pendingTests) > 0 ? 2500 : null
  );

  useEffect(() => {
    console.log('Data Changed', data);
  }, [data]);

  const handleTestCreated = (
    response: CreateExperimentTestJobResponse
  ): void => {
    setData((prevData) => [cloneDeep(response.test), ...cloneDeep(prevData)]);
    setPendingTests((prevTests) => [cloneDeep(response.test), ...prevTests]);
    // TODO: Monitor the test status
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <TestListTableHeader onTestCreated={handleTestCreated} />
        <Divider />
        <TestTable data={data} />
      </CardContent>
    </Card>
  );
};

export default TestList;
