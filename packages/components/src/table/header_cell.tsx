'use client';
import React, { useEffect } from 'react';
import { Box, TableCell, TableSortLabel } from '@mui/material';
import { Header, flexRender } from '@tanstack/react-table';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TextField } from '../form';

export interface HeaderCellProps<Data> {
  header: Header<Data, unknown>;
}

export function HeaderCell<Data>(
  props: HeaderCellProps<Data>
): React.ReactElement {
  const [showSearch, setShowSearch] = React.useState(false);
  const { header } = props;

  useEffect(() => {
    if (!showSearch) {
      header.column.setFilterValue('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSearch]);

  const sortDirection = header.column.getIsSorted();
  return (
    <TableCell key={header.id} sortDirection={sortDirection}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TableSortLabel
          active={header.column.getIsSorted() !== false}
          direction={sortDirection === false ? undefined : sortDirection}
          onClick={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </TableSortLabel>
        <FilterListIcon
          fontSize="small"
          sx={{
            ml: 1,
            cursor: 'pointer',
          }}
          onClick={() => {
            setShowSearch(!showSearch);
          }}
        />
      </Box>
      {showSearch && (
        <TextField
          autoFocus
          placeholder="Search..."
          fullWidth
          value={header.column.getFilterValue()}
          onChange={(e) => {
            header.column.setFilterValue(e.target.value);
          }}
        />
      )}
    </TableCell>
  );
}
