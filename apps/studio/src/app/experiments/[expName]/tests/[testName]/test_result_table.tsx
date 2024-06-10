'use client';

import { Paper } from '@mui/material';
import { ExperimentTest } from '@palico-ai/common';
import { RenderCellFN, Table, useTableModel } from '@palico-ai/components';
import {
  TestTableColumnHeader,
  flattenExperimentColumns,
} from '../../../../../utils/experiments';
import React from 'react';
import TestCellConversationID from '../../../../../components/table/test_cell_conversation_id';

export interface TestResultTableProps {
  test: ExperimentTest;
}

const TestResultTable: React.FC<TestResultTableProps> = ({ test }) => {
  const [data] = React.useState(test.result);
  const columns = flattenExperimentColumns(test.result);
  const table = useTableModel({
    data,
    columns,
  });

  const renderCell: RenderCellFN<ExperimentTest['result'][0]> = (
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
