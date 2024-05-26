'use client';

import {
  ExperimentTestMetadata,
  ExperimentTestStatus,
} from '@palico-ai/common';
import React from 'react';
import {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { Chip, RenderCellFN, Table, Typography } from '@palico-ai/components';
import { RoutePath } from '../../../utils/route_path';

interface TestListProps {
  data: ExperimentTestMetadata[];
}

const CELL_HEADER = {
  NAME: 'Name',
  DESCRIPTION: 'Description',
  STATUS: 'Status',
  AGENT: 'Agent',
  WORKFLOW: 'Workflow',
  DATASET: 'Dataset',
  CREATED_AT: 'Created At',
};

const isStatusCell = (cell: Cell<ExperimentTestMetadata, unknown>) => {
  return cell.column.columnDef.header === 'Status';
};

const columns: ColumnDef<ExperimentTestMetadata, unknown>[] = [
  {
    accessorKey: 'testName',
    header: CELL_HEADER.NAME,
  },
  {
    accessorKey: 'testDescription',
    header: CELL_HEADER.DESCRIPTION,
  },
  {
    accessorKey: 'status.state',
    header: CELL_HEADER.STATUS,
  },
  {
    accessorKey: 'agentName',
    header: CELL_HEADER.AGENT,
  },
  {
    accessorKey: 'workflowName',
    header: CELL_HEADER.WORKFLOW,
  },
  {
    accessorKey: 'testCaseDatasetName',
    header: CELL_HEADER.DATASET,
  },
  {
    header: CELL_HEADER.CREATED_AT,
    accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

const TestTable: React.FC<TestListProps> = ({ data }) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const router = useRouter();

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

  const handleRowClick = (row: ExperimentTestMetadata) => {
    router.push(
      RoutePath.experimentTestItem({
        experimentName: row.experimentName,
        testName: row.testName,
      })
    );
  };

  const renderCell: RenderCellFN<ExperimentTestMetadata> = (
    cell: Cell<ExperimentTestMetadata, unknown>
  ) => {
    if (isStatusCell(cell)) {
      const status = cell.getValue() as ExperimentTestStatus;
      return (
        <Chip
          size="small"
          label={
            <Typography variant="caption" textTransform={'lowercase'}>
              {status}
            </Typography>
          }
          variant="outlined"
          color={
            status === ExperimentTestStatus.SUCCESS
              ? 'success'
              : status === ExperimentTestStatus.FAILED
              ? 'error'
              : status === ExperimentTestStatus.ACTIVE ||
                status === ExperimentTestStatus.CREATED
              ? 'warning'
              : 'default'
          }
        />
      );
    }
    return flexRender(cell.column.columnDef.cell, cell.getContext());
  };

  return (
    <Table table={table} onClickRow={handleRowClick} renderCell={renderCell} />
  );
};

export default TestTable;
