import { Evaluation } from '@palico-ai/common';
import { ColumnDef } from '@tanstack/react-table';

export const TestTableColumnHeader = {
  UserMessage: 'User Message',
  AgentResponse: 'Agent Response',
  ConversationId: 'Conversation ID',
};

export const flattenExperimentColumns = (
  result: Evaluation['result']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ColumnDef<any>[] => {
  const allTags = new Set<string>();
  const allMetrics = new Set<string>();
  result.forEach((test) => {
    Object.keys(test.tags).forEach((tag) => allTags.add(tag));
    Object.keys(test.metrics).forEach((metric) => allMetrics.add(metric));
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staticColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'input.userMessage',
      header: TestTableColumnHeader.UserMessage,
      // TODO: Add sub row for payload
    },
    {
      accessorKey: 'output.message',
      header: TestTableColumnHeader.AgentResponse,
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tagColumns: ColumnDef<any>[] = Array.from(allTags).map((tag) => ({
    accessorKey: `tags.${tag}`,
    header: `Tag: ${tag}`,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metricColumns: ColumnDef<any>[] = Array.from(allMetrics).map(
    (metric) => ({
      accessorKey: `metrics.${metric}`,
      header: `Metric: ${metric}`,
    })
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadataColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'output.conversationId',
      header: TestTableColumnHeader.ConversationId,
    },
  ];
  return staticColumns
    .concat(tagColumns)
    .concat(metricColumns)
    .concat(metadataColumns);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getColumnsForFlattenData = (data: Record<string, unknown>[]) => {
  const columnNames = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => columnNames.add(key));
  });
  const columnDefs: ColumnDef<unknown, unknown>[] = Array.from(columnNames).map(
    (key) => ({
      accessorKey: key,
      header: key,
    })
  );
  return {
    columnNames,
    columnDefs,
  };
};
