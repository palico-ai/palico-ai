'use client';

import { Box } from '@mui/material';
import { useMemo } from 'react';
import NotebookRow, { AddNewRow } from './row/row';
import { useNotebookRowManipulation } from './notebook.context';
import ImportDatasetRow from './datasets/import_dataset';

const Notebook: React.FC = () => {
  const { rows, handleAddRow, handleDeleteRow, handleAddRowAtEnd } =
    useNotebookRowManipulation();

  const rowJSX = useMemo(() => {
    return rows.map((row, index) => {
      return (
        <NotebookRow
          rowIndex={index}
          key={index}
          widget={row}
          handleAddRowAbove={() => {
            handleAddRow(index);
          }}
          handleAddRowBelow={() => {
            handleAddRow(index + 1);
          }}
          handleDeleteRow={() => {
            handleDeleteRow(index);
          }}
        />
      );
    });
  }, [handleAddRow, handleDeleteRow, rows]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <ImportDatasetRow />
      {rowJSX}
      <AddNewRow handleAddRow={handleAddRowAtEnd} />
    </Box>
  );
};

export default Notebook;
