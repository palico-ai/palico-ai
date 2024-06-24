import { Evaluation, EvalResult } from '@palico-ai/common';
import { ColumnDef } from '@tanstack/react-table';
import { TestTableColumnHeader } from '../../../../../utils/experiments';

// TOOD: Consolidate with utils/experiments.ts

export interface TestResultWithIdentifier extends EvalResult {
  name: string;
}

export const CreateEvalResultDatasets = (
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

const getAllMetrics = (data: TestResultWithIdentifier[]) => {
  const metrics = new Set<string>();
  data.forEach((item) => {
    Object.keys(item.metrics).forEach((key) => {
      metrics.add(key);
    });
  });
  return Array.from(metrics);
};

const getAllTags = (data: TestResultWithIdentifier[]) => {
  const tags = new Set<string>();
  data.forEach((item) => {
    Object.keys(item.tags).forEach((key) => {
      tags.add(key);
    });
  });
  return Array.from(tags);
};

export const createColumnDefs = (data: TestResultWithIdentifier[]) => {
  const columns: ColumnDef<TestResultWithIdentifier>[] = [
    {
      accessorKey: 'name',
      header: 'Test Name',
    },
    {
      accessorKey: 'input.userMessage',
      header: 'Input::User Message',
    },
    {
      accessorKey: 'input.payload',
      header: 'Input::Payload',
      cell: (item) => JSON.stringify(item.getValue()),
    },
    {
      accessorKey: 'output.message',
      header: 'Output::Response',
    },
    {
      accessorKey: 'output.data',
      header: 'Output::Data',
      cell: (item) => JSON.stringify(item.getValue()),
    },
  ];
  const tags = getAllTags(data);
  tags.forEach((tag) => {
    columns.push({
      accessorKey: `tags.${tag}`,
      header: `Tags::${tag}`,
    });
  });
  const metrics = getAllMetrics(data);
  metrics.forEach((metric) => {
    columns.push({
      accessorKey: `metrics.${metric}`,
      header: `Metrics::${metric}`,
    });
  });
  columns.push({
    accessorKey: 'output.conversationId',
    header: TestTableColumnHeader.ConversationId,
  });
  return columns;
};
