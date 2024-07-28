import { Box, Divider } from '@mui/material';
import { Button } from '@palico-ai/components';
import React, { useMemo } from 'react';
import RowHeaderActions from './row_header';
import EmptyRowWidget from './empty';
import TableNotebookWidget from './table';
import TextboxNotebookWidget from './textbox';
import { NotebookWidget } from '@palico-ai/common';

interface NotebookRowProps {
  rowIndex: number;
  handleAddRowAbove: () => void;
  handleAddRowBelow: () => void;
  handleDeleteRow: () => void;
  widget: NotebookWidget;
}

const NotebookRow: React.FC<NotebookRowProps> = ({
  rowIndex,
  handleAddRowBelow,
  handleDeleteRow,
  handleAddRowAbove,
  widget,
}) => {
  const rowWidget = useMemo(() => {
    switch (widget.type) {
      case 'table':
        return <TableNotebookWidget index={rowIndex} />;
      case 'text':
        return <TextboxNotebookWidget index={rowIndex} />;
      default:
        return <EmptyRowWidget />;
    }
  }, [rowIndex, widget.type]);

  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <RowHeaderActions
        rowIndex={rowIndex}
        handleAddRowAbove={handleAddRowAbove}
        handleAddRowBelow={handleAddRowBelow}
        handleDeleteRow={handleDeleteRow}
      />
      <Divider sx={{ my: 1 }} />
      <Box
        sx={{
          backgroundColor: 'background.paper',
          padding: 2,
        }}
      >
        {rowWidget}
      </Box>
    </Box>
  );
};

interface AddNewRowProps {
  handleAddRow: () => void;
}

export const AddNewRow: React.FC<AddNewRowProps> = ({ handleAddRow }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleAddRow}
      >
        Add New Row
      </Button>
    </Box>
  );
};

export default NotebookRow;
