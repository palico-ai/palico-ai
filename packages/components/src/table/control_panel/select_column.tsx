'use client';

import { Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import { Table } from '@tanstack/react-table';
import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Typography } from '../../typography';
import { OptionPanel } from './option_drawer';

interface SelectColumnProps<D> {
  table: Table<D>;
}

function SelectColumnControl<D>(props: SelectColumnProps<D>) {
  const { table } = props;

  return (
    <OptionPanel
      button={
        <Tooltip title="Select Columns" placement="top">
          <VisibilityIcon />
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
        Display Columns
      </Typography>
      {table.getAllLeafColumns().map((column) => (
        <FormControlLabel
          key={column.id}
          label={
            <Typography variant="body2">
              {column.columnDef.header?.toString() ?? column.id}
            </Typography>
          }
          control={
            <Checkbox
              color="info"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
          }
        />
      ))}
    </OptionPanel>
  );
}

export default SelectColumnControl;
