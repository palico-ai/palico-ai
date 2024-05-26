'use client';

import { Paper } from '@mui/material';
import { ExperimentTest } from '@palico-ai/common';
import { Table } from '@palico-ai/components';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';

export interface TestResultTableProps {
  test: ExperimentTest;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createColumns = (result: ExperimentTest['result']): ColumnDef<any>[] => {
  const allTags = new Set<string>();
  const allMetrics = new Set<string>();
  result.forEach((test) => {
    Object.keys(test.tags).forEach((tag) => allTags.add(tag));
    Object.keys(test.metrics).forEach((metric) => allMetrics.add(metric));
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staticColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'input.userMessage',
      header: 'User Message',
      // TODO: Add sub row for payload
    },
    {
      accessorKey: 'output.message',
      header: 'Agent Response',
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tagColumns: ColumnDef<any>[] = Array.from(allTags).map((tag) => ({
    accessorKey: `tags.${tag}`,
    header: `Tag: ${tag}`,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metricColumns: ColumnDef<any>[] = Array.from(allMetrics).map(
    (metric) => ({
      accessorKey: `metrics.${metric}`,
      header: `Metric: ${metric}`,
    })
  );
  return staticColumns.concat(tagColumns).concat(metricColumns);
};

const TestResultTable: React.FC<TestResultTableProps> = ({ test }) => {
  const [data] = React.useState(test.result);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const columns = createColumns(test.result);
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
