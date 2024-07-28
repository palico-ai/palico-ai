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
import {
  Cell,
  Table as TANTable,
  TableOptions,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable as useTanTable,
} from '@tanstack/react-table';
import { HeaderCell } from './header_cell';
import TableRow from './row';
import TableControlPanel from './control_panel';
import {
  OnChangeColumnAggregation,
  TableContextProvider,
} from './table.contex';
import { useState } from 'react';

export type RenderCellFN<Data> = (
  cell: Cell<Data, unknown>,
  renderContent: () => React.ReactNode // Used to render the content of the cell in table's data
) => React.ReactNode;

export interface TableParams<Data> {
  table: TANTable<Data>;
  maxHeight?: number | string;
  onChangeColumnAggregation?: OnChangeColumnAggregation<Data>;
  onClickRow?: (row: Data) => void;
  renderCell?: RenderCellFN<Data>;
}

export type UseTableOptions<Data> = Pick<
  TableOptions<Data>,
  | 'data'
  | 'columns'
  | 'enableGrouping'
  | 'initialState'
  | 'state'
  | 'onStateChange'
>;

export function useTableModel<Data>(options: UseTableOptions<Data>) {
  const enableGrouping = options.enableGrouping ?? false;
  const table = useTanTable<Data>({
    ...options,
    getFilteredRowModel: getFilteredRowModel(),
    enableGrouping,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return table;
}

export function useControlledStateTable<Data>(table: TANTable<Data>) {
  const [state, setState] = useState(table.initialState);
  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
  }));
  return state;
}

export function Table<Data>(props: TableParams<Data>): React.ReactElement {
  const {
    table,
    maxHeight,
    onClickRow,
    renderCell,
    onChangeColumnAggregation,
  } = props;
  const { pageSize, pageIndex } = table.getState().pagination;

  console.log(table._getColumnDefs());

  return (
    <Box>
      <TableContextProvider
        table={table}
        onChangeColumnAggregationFN={onChangeColumnAggregation}
      >
        <TableControlPanel table={table} />
        <TableContainer
          sx={{
            ...(maxHeight ? { maxHeight, overflowY: 'auto' } : {}),
          }}
        >
          <MUITable
            stickyHeader={maxHeight !== undefined}
            sx={
              {
                // width: table.getCenterTotalSize(),
              }
            }
          >
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
                  <TableRow
                    key={row.id}
                    onClickRow={onClickRow}
                    row={row}
                    renderCell={renderCell}
                  />
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
            { label: 'All', value: table.getRowCount() },
          ]}
          component={Box}
          count={table.getRowCount()}
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
      </TableContextProvider>
    </Box>
  );
}
