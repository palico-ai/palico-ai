'use client';

import { ExperimentTestMetadata } from '@palico-ai/common';
import React, { useEffect } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface TestListProps {
  data: ExperimentTestMetadata[];
}

const TestTable: React.FC<TestListProps> = ({ data }) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  useEffect(() => {
    console.log('Data Changed in table', data);
  }, [data])

  const columns = React.useMemo<
    ColumnDef<ExperimentTestMetadata, unknown>[]
  >(() => {
    return [
      {
        accessorKey: 'testName',
        header: 'Name',
      },
      {
        accessorKey: 'testDescription',
        header: 'Description',
      },
      {
        accessorKey: 'status.state',
        header: 'Status',
      },
      {
        accessorKey: 'agentName',
        header: 'Agent',
      },
      {
        accessorKey: 'workflowName',
        header: 'Workflow',
      },
      {
        accessorKey: 'testCaseDatasetName',
        header: 'Dataset',
      },
      {
        header: 'Created At',
        accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
      },
    ];
  }, []);
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TestTable;
