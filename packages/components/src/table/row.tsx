import { Cell, Row, flexRender } from '@tanstack/react-table';
import { Box, TableRow as MUITableRow, TableCell } from '@mui/material';
import React, { useEffect } from 'react';
import { TableParams } from './table';
import ExpandCellIcon from '@mui/icons-material/UnfoldMore';
import CollapseCellIcon from '@mui/icons-material/UnfoldLess';

export interface TableRowParams<Data> {
  row: Row<Data>;
  onClickRow?: TableParams<Data>['onClickRow'];
  renderCell?: TableParams<Data>['renderCell'];
}

function TableRow<D>(props: TableRowParams<D>): React.ReactElement {
  const { row, onClickRow, renderCell } = props;

  useEffect(() => {
    console.log('row changed');
  }, [row]);

  // useEffect(() => {
  //   console.log('row expanded changed');
  // }, [isRowExpanded]);

  const handleRenderCellValue = (cell: Cell<D, unknown>) => {
    if (renderCell) {
      return renderCell(cell, () =>
        flexRender(cell.column.columnDef.cell, cell.getContext())
      );
    }
    return flexRender(cell.column.columnDef.cell, cell.getContext());
  };

  const renderCellContent = (cell: Cell<D, unknown>) => {
    const isRowExpanded = row.getIsExpanded();
    if (cell.getIsGrouped()) {
      const CellIcon = isRowExpanded ? CollapseCellIcon : ExpandCellIcon;
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CellIcon
            fontSize="small"
            sx={{
              cursor: 'pointer',
              mr: 1,
            }}
            onClick={row.getToggleExpandedHandler()}
          />
          {handleRenderCellValue(cell)}
        </Box>
      );
    }
    if (cell.getIsAggregated()) {
      return flexRender(
        cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
        cell.getContext()
      );
    }
    if (cell.getIsPlaceholder()) {
      return null;
    }
    return handleRenderCellValue(cell);
  };

  return (
    <MUITableRow
      key={row.id}
      hover={!!onClickRow}
      sx={{
        ...(!!onClickRow && { cursor: 'pointer' }),
      }}
      onClick={onClickRow ? () => onClickRow(row.original) : undefined}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <TableCell width={cell.column.getSize()} key={cell.id}>
            {renderCellContent(cell)}
          </TableCell>
        );
      })}
    </MUITableRow>
  );
}

export default TableRow;
