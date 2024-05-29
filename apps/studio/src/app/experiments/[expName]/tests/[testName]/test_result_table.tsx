'use client';

import { Paper } from '@mui/material';
import { ExperimentTest } from '@palico-ai/common';
import { Table } from '@palico-ai/components';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { flattenExperimentColumns } from '../../../../../utils/experiments';
import React from 'react';

export interface TestResultTableProps {
  test: ExperimentTest;
}

const TestResultTable: React.FC<TestResultTableProps> = ({ test }) => {
  const [data] = React.useState(test.result);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const columns = flattenExperimentColumns(test.result);
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Table table={table} />
    </Paper>
  );
};

export default TestResultTable;
