import { Table } from '@palico-ai/components';
import React from 'react';
import { useTableWidget } from '../../notebook.context';
import { Box } from '@mui/material';

interface TableNotebookWidgetProps {
  index: number;
}

const TableNotebookWidget: React.FC<TableNotebookWidgetProps> = ({ index }) => {
  const { table, handleChangeColumnAggregation } = useTableWidget(index);

  return (
    <Box>
      <Table
        maxHeight={'75vh'}
        table={table}
        onChangeColumnAggregation={handleChangeColumnAggregation}
      />
    </Box>
  );
};

export default TableNotebookWidget;
