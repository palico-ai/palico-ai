'use client';

import {
  AggregationFnOption,
  ColumnDef,
  Table as TANTable,
} from '@tanstack/react-table';
import { cloneDeep } from 'lodash';
import React, { Context } from 'react';

export interface TableContextParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: TANTable<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeColumns?: (columns: ColumnDef<any>[]) => void;
}

const TableContext: Context<TableContextParams> = React.createContext(
  {} as TableContextParams
);

export interface TableContextProviderProps {
  table: TableContextParams['table'];
  onChangeColumns?: TableContextParams['onChangeColumns'];
  children: React.ReactNode;
}

export function TableContextProvider(
  props: TableContextProviderProps
): React.ReactElement {
  const { table, onChangeColumns, children } = props;
  return (
    <TableContext.Provider value={{ table, onChangeColumns }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable<D>() {
  const { table } = React.useContext(TableContext);
  return table as TANTable<D>;
}

export function useTableColumns<D>() {
  const { table, onChangeColumns } = React.useContext(TableContext);

  const changeColumnAggregationFn = (
    columnId: string,
    fnName: AggregationFnOption<D>
  ) => {
    console.log('changeColumnAggregationFn', columnId, fnName);
    const column = table.getColumn(columnId);
    if (!column || !onChangeColumns) return;
    const newColumns = cloneDeep(table._getColumnDefs()).map((col) => {
      if (col.header === columnId) {
        col.aggregationFn = fnName;
      }
      return col;
    });
    onChangeColumns(newColumns);
    table.setGrouping([]);
  };

  return {
    columns: table._getColumnDefs() as ColumnDef<D>[],
    onChangeColumns: onChangeColumns,
    changeColumnAggregationFn: onChangeColumns
      ? changeColumnAggregationFn
      : undefined,
  };
}

export default TableContext;
