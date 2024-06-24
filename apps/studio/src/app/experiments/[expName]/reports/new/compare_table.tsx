'use client';

import { Evaluation } from '@palico-ai/common';
import React, { useEffect, useMemo, useState } from 'react';
import { CreateEvalResultDatasets, createColumnDefs } from './data_utils';
import { RenderCellFN, Table, useTableModel } from '@palico-ai/components';
import { Paper } from '@mui/material';
import { TestTableColumnHeader } from '../../../../../utils/experiments';
import TestCellConversationID from '../../../../../components/table/test_cell_conversation_id';

interface MultiTestCompareTableProps {
  evals: Evaluation[];
}

const MultiEvalCompareTable: React.FC<MultiTestCompareTableProps> = ({
  evals: tests,
}) => {
  const dataset = useMemo(() => CreateEvalResultDatasets(tests), [tests]);
  const [columns, setColumns] = useState(createColumnDefs(dataset));

  useEffect(() => {
    console.log(columns);
  }, [columns]);

  const table = useTableModel({
    columns,
    data: dataset,
    enableGrouping: true,
  });

  const renderCell: RenderCellFN<(typeof dataset)[0]> = (
    cell,
    renderContent
  ) => {
    if (cell.column.columnDef.header === TestTableColumnHeader.ConversationId) {
      return (
        <TestCellConversationID cell={cell} renderContent={renderContent} />
      );
    }
    return renderContent();
  };

  return (
    <Paper
      sx={{
        p: 2,
      }}
    >
      <Table
        table={table}
        onChangeColumns={setColumns}
        renderCell={renderCell}
      />
    </Paper>
  );
};

export default MultiEvalCompareTable;
