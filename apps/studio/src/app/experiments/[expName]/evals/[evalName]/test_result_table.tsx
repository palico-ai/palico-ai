'use client';

import { Paper } from '@mui/material';
import { Evaluation } from '@palico-ai/common';
import { RenderCellFN, Table, useTableModel } from '@palico-ai/components';
import { TestTableColumnHeader } from '../../../../../utils/experiments';
import React from 'react';
import TestCellConversationID from '../../../../../components/table/test_cell_conversation_id';
import {
  ANALYSIS_TABLE_COL_ID,
  getEvalTestColumnDefFragment,
} from '../../../../../utils/evaluation';

export interface TestResultTableProps {
  test: Evaluation;
}

const TestResultTable: React.FC<TestResultTableProps> = ({ test }) => {
  const [data] = React.useState(test.result);
  const table = useTableModel({
    data,
    columns: getEvalTestColumnDefFragment(test.result),
    initialState: {
      columnVisibility: {
        [ANALYSIS_TABLE_COL_ID.responseData]: false,
        [ANALYSIS_TABLE_COL_ID.payload]: false,
      },
    },
  });

  const renderCell: RenderCellFN<Evaluation['result'][0]> = (
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
    <Paper sx={{ p: 2 }}>
      <Table table={table} renderCell={renderCell} />
    </Paper>
  );
};

export default TestResultTable;
