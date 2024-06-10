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
  ColumnDef,
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
import { TableContextParams, TableContextProvider } from './table.contex';

export type RenderCellFN<Data> = (
  cell: Cell<Data, unknown>,
  renderContent: () => React.ReactNode // Used to render the content of the cell in table's data
) => React.ReactNode;

export interface TableParams<Data> {
  table: TANTable<Data>;
  onChangeColumns?: (columns: ColumnDef<Data>[]) => void;
  onClickRow?: (row: Data) => void;
  renderCell?: RenderCellFN<Data>;
}

export type UseTableOptions<Data> = Pick<
  TableOptions<Data>,
  'data' | 'columns'
> & {
  enableGrouping?: boolean;
};

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

export function Table<Data>(props: TableParams<Data>): React.ReactElement {
  const { table, onClickRow, renderCell, onChangeColumns } = props;
  const { pageSize, pageIndex } = table.getState().pagination;

  return (
    <Box>
      <TableContextProvider
        table={table}
        onChangeColumns={
          onChangeColumns as TableContextParams['onChangeColumns']
        }
      >
        <TableControlPanel table={table} />
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
