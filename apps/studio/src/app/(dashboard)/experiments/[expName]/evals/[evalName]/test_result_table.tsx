'use client';

import { Paper } from '@mui/material';
import { Evaluation } from '@palico-ai/common';
import { Table, useTableModel } from '@palico-ai/components';
import React from 'react';
import {
  ANALYSIS_TABLE_COL_ID,
  getEvalTestColumnDefFragment,
} from '../../../../../../utils/evaluation';

export interface TestResultTableProps {
  test: Evaluation;
}

const TestResultTable: React.FC<TestResultTableProps> = ({ test }) => {
  const [data] = React.useState(test.result);
  const table = useTableModel({
    data,
    columns: getEvalTestColumnDefFragment(test.result),
    initialState: {
      columnVisibility: {
        [ANALYSIS_TABLE_COL_ID.responseData]: false,
        [ANALYSIS_TABLE_COL_ID.payload]: false,
      },
    },
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Table table={table} />
    </Paper>
  );
};

export default TestResultTable;
