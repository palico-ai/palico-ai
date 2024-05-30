import React, { useEffect, useMemo } from 'react';
import { Dataframe } from '../analysis.context';
import { Table, Typography } from '@palico-ai/components';
import {
  ColumnDef,
  ColumnFiltersState,
  GroupingState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Box, Divider } from '@mui/material';
import {
  getColumnsForFlattenData,
  flattenTestResult,
} from '../../../../utils/experiments';

export interface DatasetTabPanelProps {
  dataset: Dataframe['dataset'];
}

interface TableConfigProps {
  label: string;
  children: React.ReactNode;
}

export const TableConfigBox: React.FC<TableConfigProps> = ({
  label,
  children,
}) => {
  return (
    <Box
      sx={(theme) => ({
        paddingY: theme.spacing(1),
        paddingX: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        overflowX: 'auto',
      })}
    >
      <Typography variant="subtitle2">{label}</Typography>
      <Divider orientation="vertical" flexItem />
      {children}
    </Box>
  );
};

const DatasetTabPanel: React.FC<DatasetTabPanelProps> = ({ dataset }) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [grouping, setGrouping] = React.useState<GroupingState>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenDataset = useMemo(() => flattenTestResult(dataset), [dataset]);
  const [columnDef, setColumnDef] = React.useState(
    getColumnsForFlattenData(flattenDataset).columnDefs as ColumnDef<
      (typeof flattenDataset)[0]
    >[]
  );

  useEffect(() => {
    console.log('columnDef changed', columnDef);
  }, [columnDef]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = useReactTable<any>({
    data: flattenDataset,
    columns: columnDef,
    state: {
      columnFilters,
      grouping,
    },
    onGroupingChange: setGrouping,
    autoResetExpanded: false,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Box>
      <Table table={table} onChangeColumns={setColumnDef} />
    </Box>
  );
};

export default DatasetTabPanel;
