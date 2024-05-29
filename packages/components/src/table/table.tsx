'use client';
import {
  Box,
  TableContainer,
  Table as MUITable,
  TableHead,
  TableRow as MUITableRow,
  TableBody,
  TablePagination,
} from '@mui/material';
import { Cell, Table as TANTable } from '@tanstack/react-table';
import { HeaderCell } from './header_cell';
import TableRow from './row';
import { useMemo } from 'react';

export type RenderCellFN<Data> = (cell: Cell<Data, unknown>) => React.ReactNode;

export interface TableParams<Data> {
  table: TANTable<Data>;
  onClickRow?: (row: Data) => void;
}

export function Table<Data>(props: TableParams<Data>): React.ReactElement {
  const { table, onClickRow } = props;
  const { pageSize, pageIndex } = table.getState().pagination;

  return (
    <Box>
      <TableContainer>
        <MUITable>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <MUITableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <HeaderCell key={header.id} header={header} />
                ))}
              </MUITableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id} onClickRow={onClickRow} row={row} />
              );
            })}
          </TableBody>
        </MUITable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[
          5,
          10,
          25,
          { label: 'All', value: table.getFilteredRowModel().rows.length },
        ]}
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
}
