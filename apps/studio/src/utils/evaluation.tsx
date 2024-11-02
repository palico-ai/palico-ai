import { EvalTestCaseResult } from '@palico-ai/common';
import { aggregationFns, ColumnDef } from '@tanstack/react-table';
import { EvalResultTableCell } from '../components/table/eval_result_table_cell';
import { Box } from '@mui/material';
import { LinkButton } from '@palico-ai/components';
import { RoutePath } from './route_path';

export const EVAL_RESULT_ACCESSOR_KEYS = {
  userMessage: 'input.userMessage',
  payload: 'input.payload',
  response: 'output.message',
  data: 'output.data',
  conversationId: 'output.conversationId',
  tag: (tag: string) => `tags.${tag}`,
  metric: (metric: string) => `metrics.${metric}.score`,
};

export const ANALYSIS_TABLE_COL_ID = {
  label: 'label',
  userMessage: 'userMessage',
  payload: 'payload',
  response: 'response',
  responseData: 'responseData',
  conversationId: 'conversationId',
  tag: (tag: string) => `tag.${tag}`,
  metric: (metric: string) => `metric.${metric}`,
};

export const getAllMetrics = (data: EvalTestCaseResult[]) => {
  const metrics = new Set<string>();
  data.forEach((item) => {
    Object.keys(item.metrics).forEach((key) => {
      metrics.add(key);
    });
  });
  return Array.from(metrics);
};

export const getAllTags = (data: EvalTestCaseResult[]) => {
  const tags = new Set<string>();
  data.forEach((item) => {
    Object.keys(item.tags).forEach((key) => {
      tags.add(key);
    });
  });
  return Array.from(tags);
};

export function getEvalTestColumnDefFragment<D extends EvalTestCaseResult>(
  dataset: D[],
  overrideColumnDef: ColumnDef<D>[] = []
): ColumnDef<D>[] {
  // TODO: Link Conversation ID Column to Trace ID
  const tags = getAllTags(dataset);
  const metrics = getAllMetrics(dataset);
  const tagsColumnDef = tags.map((tag) => ({
    id: ANALYSIS_TABLE_COL_ID.tag(tag),
    accessorKey: EVAL_RESULT_ACCESSOR_KEYS.tag(tag),
    header: 'T:' + tag,
    size: 120,
  }));

  const metricsColumnDef: ColumnDef<D>[] = metrics.map((metric) => ({
    id: ANALYSIS_TABLE_COL_ID.metric(metric),
    accessorKey: EVAL_RESULT_ACCESSOR_KEYS.metric(metric),
    aggregationFn: aggregationFns.mean,
    header: 'M:' + metric,
    size: 120,
  }));
  const columnDef: ColumnDef<D>[] = [
    {
      id: ANALYSIS_TABLE_COL_ID.userMessage,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.userMessage,
      header: 'I:Message',
      size: 120,
      cell: ({ row }) => (
        <EvalResultTableCell value={row.original.input.userMessage} />
      ),
    },
    {
      id: ANALYSIS_TABLE_COL_ID.payload,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.payload,
      header: 'I:Payload',
      size: 120,
      cell: ({ row }) => (
        <EvalResultTableCell
          isCode
          value={JSON.stringify(row.original.input.payload, null, 2)}
        />
      ),
    },
    ...tagsColumnDef,
    {
      id: ANALYSIS_TABLE_COL_ID.response,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.response,
      header: 'O:Response',
      size: 120,
      cell: ({ row }) => (
        <EvalResultTableCell value={row.original.output.message} />
      ),
    },
    {
      id: ANALYSIS_TABLE_COL_ID.responseData,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.data,
      header: 'O:Data',
      size: 120,
      cell: ({ row }) => (
        <EvalResultTableCell
          isCode
          value={JSON.stringify(row.original.output.data, null, 2)}
        />
      ),
    },
    ...metricsColumnDef,
    {
      id: ANALYSIS_TABLE_COL_ID.conversationId,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.conversationId,
      header: 'Actions',
      size: 240,
      cell: ({ row }) => (
        <Box>
          <LinkButton
            openInNewTab
            href={RoutePath.requestTraceItem({
              requestId: row.original.output.requestId,
            })}
          >
            Traces
          </LinkButton>
        </Box>
      ),
    },
  ];
  const overrideColumnDefMap: Record<string, ColumnDef<D>> = {};
  overrideColumnDef.forEach((def) => {
    if (def.id === undefined) {
      throw new Error('ColumnDef must have an id');
    }
    overrideColumnDefMap[def.id] = def;
  });

  return columnDef.map((def) => {
    if (def.id === undefined) {
      return def;
    }
    const overrideDef = overrideColumnDefMap[def.id];
    return overrideDef ? { ...def, ...overrideDef } : def;
  });
}
