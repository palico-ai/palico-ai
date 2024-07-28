'use client';

import {
  AggregationFnOption,
  ColumnDef,
  GroupingState,
  Table as TANTable,
} from '@tanstack/react-table';
import { cloneDeep } from 'lodash';
import React, { Context, useEffect } from 'react';

export type OnChangeColumnAggregation<Data> = (
  id: string,
  aggregationFn: AggregationFnOption<Data>
) => void;

export interface TableContextParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: TANTable<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeColumnAggregationFN?: OnChangeColumnAggregation<any>;
}

const TableContext: Context<TableContextParams> = React.createContext(
  {} as TableContextParams
);

export interface TableContextProviderProps {
  table: TableContextParams['table'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeColumnAggregationFN?: OnChangeColumnAggregation<any>;
  children: React.ReactNode;
}

export function TableContextProvider(
  props: TableContextProviderProps
): React.ReactElement {
  const { table, onChangeColumnAggregationFN, children } = props;
  return (
    <TableContext.Provider value={{ table, onChangeColumnAggregationFN }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable<D>() {
  const { table } = React.useContext(TableContext);
  return table as TANTable<D>;
}

export function useTableColumns<D>() {
  const { table, onChangeColumnAggregationFN } = React.useContext(TableContext);
  const [previousGrouping, setPreviousGrouping] =
    React.useState<GroupingState>();

  useEffect(() => {
    // When a new column aggregation is set, we need to wait for that state to update,
    // then rerender. This is a hacky way to do that.
    if (previousGrouping) {
      table.setGrouping(previousGrouping);
      setPreviousGrouping(undefined);
    }
  }, [previousGrouping, table]);

  const changeColumnAggregationFn = (
    columnDef: ColumnDef<D>,
    fnName: AggregationFnOption<D>
  ) => {
    if (!onChangeColumnAggregationFN) {
      return;
    }
    if (!columnDef.id) {
      console.error('Column id is required to change aggregation function');
      return;
    }
    onChangeColumnAggregationFN(columnDef.id, fnName);
    setPreviousGrouping(cloneDeep(table.getState().grouping));
    table.setGrouping([]);
  };

  return {
    columns: table._getColumnDefs() as ColumnDef<D>[],
    changeColumnAggregationFn: onChangeColumnAggregationFN
      ? changeColumnAggregationFn
      : undefined,
  };
}

export default TableContext;
