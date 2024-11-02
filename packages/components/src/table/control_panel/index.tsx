import React from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { Table } from '@tanstack/react-table';
import { TextField } from '../../form';
import SelectColumnControl from './select_column';
import { Typography } from '../../typography';
import GroupingSettings from './grouping_options';

export interface TableControlPanelProps<Data> {
  table: Table<Data>;
}

export interface DataDisplayProps {
  label: string;
  items: {
    label: string;
    value: string;
  }[];
  handleDelete: (value: string) => void;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  items,
  label,
  handleDelete,
}) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={(theme) => ({
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        px: 2,
        py: 1,
        alignItems: 'center',
      })}
    >
      <Typography variant="caption" fontSize={12}>
        {label}
      </Typography>
      {items.map((item, index) => (
        <Chip
          key={`${index}-${item.value}`}
          size="small"
          label={item.label}
          onDelete={() => {
            handleDelete(item.value);
          }}
        />
      ))}
    </Stack>
  );
};

function TableControlPanel<Data>(props: TableControlPanelProps<Data>) {
  const { table } = props;
  const activeGroups = table.getState().grouping.map((g) => g);

  const handleRemoveGrouping = (group: string) => {
    table.getColumn(group)?.toggleGrouping();
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems={'center'}
      justifyContent={'flex-start'}
      sx={(theme) => ({
        padding: theme.spacing(1),
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      {activeGroups.length > 0 && (
        <DataDisplay
          label="Group By"
          items={activeGroups.map((groupId) => ({
            label:
              table.getColumn(groupId)?.columnDef.header?.toString() ?? groupId,
            value: groupId,
          }))}
          handleDelete={handleRemoveGrouping}
        />
      )}
      <Box sx={{ flexGrow: 1 }} />
      {table.options.enableGrouping && <GroupingSettings table={table} />}
      <SelectColumnControl table={table} />
      <TextField
        value={table.getState().globalFilter}
        onChange={(e) => {
          table.setGlobalFilter(e.target.value);
        }}
        placeholder="Search..."
        autoComplete="off"
        variant="outlined"
        size="small"
      />
    </Stack>
  );
}

export default TableControlPanel;
