'use client';

import { Table, useTableModel } from '@palico-ai/components';
import { ColumnDef } from '@tanstack/react-table';
import { RoutePath } from '../../../utils/route_path';
import { useRouter } from 'next/navigation';
import { capitalCase } from 'change-case';

const columns: ColumnDef<{
  name: string;
}>[] = [
  {
    accessorKey: 'name',
    header: 'Workflow Name',
    cell: ({ row }) => capitalCase(row.original.name),
  },
];

export interface WorkflowListTableProps {
  workflows: {
    name: string;
  }[];
}

const WorkflowListTable: React.FC<WorkflowListTableProps> = ({ workflows }) => {
  const router = useRouter();

  const table = useTableModel({
    columns,
    data: workflows ?? [],
  });

  const onClickRow = (row: { name: string }) => {
    router.push(
      RoutePath.workflowItem({
        workflowName: row.name,
      })
    );
  };

  return <Table table={table} onClickRow={onClickRow} />;
};

export default WorkflowListTable;
