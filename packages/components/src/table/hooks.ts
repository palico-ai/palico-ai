'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { OnChangeColumnAggregation } from './table.contex';
import { cloneDeep } from 'lodash';

export function useControlledTableColumns<Data>(columnDef: ColumnDef<Data>[]) {
  columnDef.forEach((col) => {
    if (!col.id) {
      throw new Error('Column id is required for controlled columns');
    }
  });
  const [columns, setColumns] = useState<ColumnDef<Data>[]>(columnDef);

  const onChangeColumnAggregationFn: OnChangeColumnAggregation<Data> = (
    id,
    aggregationFn
  ) => {
    const newColumns = cloneDeep(columns).map((col) => {
      if (col.id === id) {
        col.aggregationFn = aggregationFn;
      }
      return col;
    });
    setColumns(newColumns);
  };

  return { columns, setColumns, onChangeColumnAggregationFn };
}
