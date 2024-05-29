import React, { useMemo } from 'react';
import { Dataframe } from '../analysis.context';
import { Table, Typography } from '@palico-ai/components';
import {
  Column,
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
import { Box, Chip, Divider } from '@mui/material';
import {
  getColumnsForFlattenData,
  flattenTestResult,
} from '../../../../utils/experiments';

export interface DatasetTabPanelProps {
  dataset: Dataframe['dataset'];
}

interface ColumnPillProps {
  column: Column<any, unknown>;
}

const ColumnPill: React.FC<ColumnPillProps> = ({ column }) => {
  return (
    <Chip
      size="small"
      label={column.id}
      variant={column.getIsVisible() ? 'filled' : 'outlined'}
      onClick={column.getToggleVisibilityHandler()}
    />
  );
};

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
  const { columnDefs } = useMemo(() => {
    return getColumnsForFlattenData(flattenDataset);
  }, [flattenDataset]);
  const table = useReactTable<any>({
    data: flattenDataset,
    columns: columnDefs,
    state: {
      columnFilters,
      grouping,
    },
    onGroupingChange: setGrouping,
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TableConfigBox label="Test Datasets">
          <Chip
            label={`${dataset[0].experimentName} - ${dataset[0].testName}`}
            size="small"
          />
        </TableConfigBox>
        <TableConfigBox label="Show Columns">
          {table.getAllLeafColumns().map((column) => (
            <ColumnPill key={column.id} column={column} />
          ))}
        </TableConfigBox>
      </Box>
      <Table table={table} />
    </Box>
  );
};

export default DatasetTabPanel;
