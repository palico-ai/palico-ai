'use client';

import { Paper } from '@mui/material';
import { ExperimentTest } from '@palico-ai/common';
import { Table, useTableModel } from '@palico-ai/components';
import { flattenExperimentColumns } from '../../../../../utils/experiments';
import React from 'react';

export interface TestResultTableProps {
  test: ExperimentTest;
}

const TestResultTable: React.FC<TestResultTableProps> = ({ test }) => {
  const [data] = React.useState(test.result);
  const columns = flattenExperimentColumns(test.result);
  const table = useTableModel({
    data,
    columns,
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Table table={table} />
    </Paper>
  );
};

export default TestResultTable;
