'use client';

import { Table } from '@tanstack/react-table';
import { Typography } from '../../typography';
import { OptionPanel } from './option_drawer';
import GroupColumnIcon from '@mui/icons-material/MergeType';
import { Divider, Tooltip } from '@mui/material';
import { TextField } from '../../form';
import { useTableColumns } from '../table.contex';

interface GroupingSettings<D> {
  table: Table<D>;
}

const aggregationFns = [
  'auto',
  'sum',
  'min',
  'max',
  'extent',
  'mean',
  'median',
  'unique',
  'uniqueCount',
  'count',
];

function GroupingSettings<D>(props: GroupingSettings<D>) {
  const { table } = props;
  const { changeColumnAggregationFn } = useTableColumns<D>();

  return (
    <OptionPanel
      button={
        <Tooltip title="Grouping Settings" placement="top">
          <GroupColumnIcon />
        </Tooltip>
      }
    >
      <Typography
        variant="h6"
        sx={(theme) => ({
          py: 1,
          width: '100%',
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        Column Aggregation
      </Typography>
      <Divider />
      {table.getAllLeafColumns().map((column) => {
        const fn = column.columnDef.aggregationFn;
        return (
          <TextField
            key={column.id}
            selectOptions={aggregationFns.map((item) => {
              return { value: item, label: item };
            })}
            value={fn}
            disabled={!changeColumnAggregationFn}
            onChange={(e) => {
              if (!changeColumnAggregationFn) return;
              e.preventDefault();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              changeColumnAggregationFn(
                column.columnDef,
                e.target.value as never
              );
            }}
            label={column.id}
            select
            fullWidth
          />
        );
      })}
    </OptionPanel>
  );
}

export default GroupingSettings;
