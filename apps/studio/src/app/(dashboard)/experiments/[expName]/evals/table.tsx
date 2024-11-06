'use client';

import React from 'react';
import { Cell, ColumnDef, flexRender } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import {
  Chip,
  RenderCellFN,
  Table,
  Typography,
  useTableModel,
} from '@palico-ai/components';
import { RoutePath } from '../../../../../utils/route_path';
import { JobQueueStatus, EvaluationMetadata } from '@palico-ai/common';

interface TestListProps {
  data: EvaluationMetadata[];
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

const isStatusCell = (cell: Cell<EvaluationMetadata, unknown>) => {
  return cell.column.columnDef.header === 'Status';
};

const columns: ColumnDef<EvaluationMetadata, unknown>[] = [
  {
    accessorKey: 'evalName',
    header: CELL_HEADER.NAME,
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
    accessorKey: 'testSuiteName',
    header: CELL_HEADER.DATASET,
  },
  {
    header: CELL_HEADER.CREATED_AT,
    accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

const EvalTable: React.FC<TestListProps> = ({ data }) => {
  const router = useRouter();
  const table = useTableModel({
    data,
    columns,
  });

  const handleRowClick = (row: EvaluationMetadata) => {
    router.push(
      RoutePath.experimentEvalItem({
        experimentName: row.experimentName,
        evalName: row.evalName,
      })
    );
  };

  const renderCell: RenderCellFN<EvaluationMetadata> = (
    cell: Cell<EvaluationMetadata, unknown>
  ) => {
    if (isStatusCell(cell)) {
      const status = cell.getValue() as JobQueueStatus;
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
            status === JobQueueStatus.SUCCESS
              ? 'success'
              : status === JobQueueStatus.FAILED
              ? 'error'
              : status === JobQueueStatus.ACTIVE ||
                status === JobQueueStatus.CREATED
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

export default EvalTable;
