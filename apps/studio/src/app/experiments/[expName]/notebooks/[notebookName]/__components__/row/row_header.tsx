import React, { useRef } from 'react';
import { useRowManipulation } from '../notebook.context';
import { Box, IconButton } from '@mui/material';
import { Button, MenuButton } from '@palico-ai/components';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import { NotebookWidgetType } from '@palico-ai/common';

interface RowHeaderActionProps {
  rowIndex: number;
  handleAddRowAbove: () => void;
  handleAddRowBelow: () => void;
  handleDeleteRow: () => void;
}

const RowHeaderActions: React.FC<RowHeaderActionProps> = ({
  rowIndex,
  handleAddRowAbove,
  handleAddRowBelow,
  handleDeleteRow,
}) => {
  const { setRowWidgetType } = useRowManipulation(rowIndex);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton
          onClick={() => {
            ref.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
        >
          <VerticalAlignCenterIcon fontSize="small" />
        </IconButton>
        <MenuButton
          menuItems={[
            {
              label: 'Add a Table',
              onClick: () => {
                setRowWidgetType(NotebookWidgetType.Table);
              },
            },
            {
              label: 'Add a Textbox',
              onClick: () => {
                setRowWidgetType(NotebookWidgetType.Text);
              },
            },
            {
              label: 'Clear Widget',
              onClick: () => {
                setRowWidgetType(NotebookWidgetType.Empty);
              },
            },
          ]}
        >
          <Button variant="contained" color="secondary" size="small">
            Set Widget
          </Button>
        </MenuButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          color="info"
          size="small"
          onClick={handleAddRowAbove}
        >
          Insert Row Above
        </Button>
        <Button
          variant="outlined"
          color="info"
          size="small"
          onClick={handleAddRowBelow}
        >
          Insert Row Below
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="warning"
          onClick={handleDeleteRow}
        >
          Delete Row
        </Button>
      </Box>
    </Box>
  );
};

export default RowHeaderActions;
