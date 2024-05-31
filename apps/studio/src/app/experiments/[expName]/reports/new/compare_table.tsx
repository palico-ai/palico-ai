'use client';

import { ExperimentTest } from '@palico-ai/common';
import React, { useMemo } from 'react';
import { CreateTestResultDatasets, createColumnDefs } from './data_utils';
import { Table, useTableModel } from '@palico-ai/components';
import { Paper } from '@mui/material';

interface MultiTestCompareTableProps {
  tests: ExperimentTest[];
}

const MultiTestCompareTable: React.FC<MultiTestCompareTableProps> = ({
  tests,
}) => {
  const dataset = useMemo(() => CreateTestResultDatasets(tests), [tests]);
  const columns = useMemo(() => createColumnDefs(dataset), [dataset]);
  const table = useTableModel({
    columns,
    data: dataset,
    enableGrouping: true,
  });
  return (
    <Paper
      sx={{
        p: 2,
      }}
    >
      <Table table={table} />
    </Paper>
  );
};

export default MultiTestCompareTable;
