'use client';

import {
  ExperimentTestMetadata,
  ExperimentTestStatus,
} from '@palico-ai/common';
import React, { useEffect } from 'react';
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
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Typography } from '@palico-ai/components';
import { useRouter } from 'next/navigation';
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

const TestTable: React.FC<TestListProps> = ({ data }) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const router = useRouter();

  useEffect(() => {
    console.log('Data Changed in table', data);
  }, [data]);

  const columns = React.useMemo<
    ColumnDef<ExperimentTestMetadata, unknown>[]
  >(() => {
    return [
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

  const { pageSize, pageIndex } = table.getState().pagination;

  return (
    <Box>
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
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    router.push(
                      RoutePath.experimentTestItem({
                        experimentName: row.original.experimentName,
                        testName: row.original.testName,
                      })
                    );
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (isStatusCell(cell)) {
                      const status = cell.getValue() as ExperimentTestStatus;
                      return (
                        <TableCell key={cell.id}>
                          <Chip
                            size="small"
                            label={
                              <Typography
                                variant="caption"
                                textTransform={'lowercase'}
                              >
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
                        </TableCell>
                      );
                    }
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: data.length }]}
        component={Box}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        slotProps={{
          select: {
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          },
        }}
        onPageChange={(_, page) => {
          table.setPageIndex(page);
        }}
        onRowsPerPageChange={(e) => {
          const size = e.target.value ? Number(e.target.value) : 10;
          table.setPageSize(size);
        }}
      />
    </Box>
  );
};

export default TestTable;
