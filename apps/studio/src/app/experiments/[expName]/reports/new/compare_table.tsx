'use client';

import { EvalTestCaseResult, Evaluation } from '@palico-ai/common';
import React, { useEffect, useMemo, useState } from 'react';
import { RenderCellFN, Table, useTableModel } from '@palico-ai/components';
import { Paper } from '@mui/material';
import { TestTableColumnHeader } from '../../../../../utils/experiments';
import TestCellConversationID from '../../../../../components/table/test_cell_conversation_id';
import { ColumnDef } from '@tanstack/react-table';
import {
  EVAL_RESULT_ACCESSOR_KEYS,
  getAllMetrics,
  getAllTags,
} from '../../../../../utils/evaluation';

interface MultiTestCompareTableProps {
  evals: Evaluation[];
}

interface TestResultWithIdentifier extends EvalTestCaseResult {
  name: string;
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

const CreateEvalResultDatasets = (
  evals: Evaluation[]
): TestResultWithIdentifier[] => {
  const dataset: TestResultWithIdentifier[] = [];
  evals.forEach((test) => {
    test.result.forEach((result) => {
      dataset.push({
        ...result,
        name: `${test.experimentName}::${test.evalName}`,
      });
    });
  });
  return dataset;
};

const createColumnDefs = (data: TestResultWithIdentifier[]) => {
  const columns: ColumnDef<TestResultWithIdentifier>[] = [
    {
      accessorKey: 'name',
      header: 'Test Name',
    },
    {
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.userMessage,
      header: 'Input::User Message',
    },
    {
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.payload,
      header: 'Input::Payload',
      cell: (item) => JSON.stringify(item.getValue()),
    },
    {
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.response,
      header: 'Output::Response',
    },
    {
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.data,
      header: 'Output::Data',
      cell: (item) => JSON.stringify(item.getValue()),
    },
  ];
  const tags = getAllTags(data);
  tags.forEach((tag) => {
    columns.push({
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.tag(tag),
      header: `Tags::${tag}`,
    });
  });
  const metrics = getAllMetrics(data);
  metrics.forEach((metric) => {
    columns.push({
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.metric(metric),
      header: `Metrics::${metric}`,
    });
  });
  columns.push({
    accessorKey: EVAL_RESULT_ACCESSOR_KEYS.conversationId,
    header: TestTableColumnHeader.ConversationId,
  });
  return columns;
};

export default MultiEvalCompareTable;
