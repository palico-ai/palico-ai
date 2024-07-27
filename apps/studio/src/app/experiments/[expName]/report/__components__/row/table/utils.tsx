import {
  EvalTestCaseWithDatasetLabel,
  TableNotebookWidgetColumnAggregatorFNMap,
} from '@palico-ai/common';
import {
  ANALYSIS_TABLE_COL_ID,
  EVAL_RESULT_ACCESSOR_KEYS,
  getAllMetrics,
  getAllTags,
} from '../../../../../../../utils/evaluation';
import { Dataset } from '../../types';
import { RenderAnalysisTableCell } from './render_cell';
import { ColumnDef } from '@tanstack/react-table';

export const getMergedEvaluationResult = (
  datasets: Dataset[]
): EvalTestCaseWithDatasetLabel[] => {
  const joinedResult: EvalTestCaseWithDatasetLabel[] = [];
  datasets.forEach((dataset) => {
    dataset.data.result.forEach((testCase) => {
      joinedResult.push({
        ...testCase,
        label: dataset.label,
      });
    });
  });
  return joinedResult;
};

const COLUMN_SIZE = {
  LARGE: 550,
  MEDIUM: 400,
  SMALL: 120,
};

export const createColumnDefs = (
  dataset: EvalTestCaseWithDatasetLabel[],
  aggregationFns: TableNotebookWidgetColumnAggregatorFNMap = {}
) => {
  const tagList = getAllTags(dataset);
  const metricList = getAllMetrics(dataset);
  const tagsColumns: ColumnDef<EvalTestCaseWithDatasetLabel>[] = tagList.map(
    (tag) => ({
      id: ANALYSIS_TABLE_COL_ID.tag(tag),
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.tag(tag),
      header: 'T:' + tag,
      size: COLUMN_SIZE.SMALL,
      aggregationFn: aggregationFns[tag] ?? 'auto',
    })
  );
  const metricsColumns: ColumnDef<EvalTestCaseWithDatasetLabel>[] =
    metricList.map((metric) => ({
      id: ANALYSIS_TABLE_COL_ID.metric(metric),
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.metric(metric),
      header: 'M:' + metric,
      size: COLUMN_SIZE.SMALL,
      aggregationFn: aggregationFns[metric] ?? 'auto',
    }));

  const columns: ColumnDef<EvalTestCaseWithDatasetLabel>[] = [
    {
      id: ANALYSIS_TABLE_COL_ID.label,
      accessorKey: 'label',
      header: 'Dataset',
      size: COLUMN_SIZE.SMALL,
      aggregationFn: aggregationFns.label ?? 'auto',
    },
    {
      id: ANALYSIS_TABLE_COL_ID.userMessage,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.userMessage,
      aggregationFn: aggregationFns.userMessage ?? 'auto',
      size: COLUMN_SIZE.LARGE,
      header: 'I:Message',
      cell: ({ cell, row }) => {
        return (
          <RenderAnalysisTableCell value={row.original.input.userMessage} />
        );
      },
    },
    {
      id: ANALYSIS_TABLE_COL_ID.payload,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.payload,
      aggregationFn: aggregationFns.payload ?? 'auto',
      header: 'I:Payload',
      size: COLUMN_SIZE.LARGE,
      cell: ({ cell, row }) => {
        return (
          <RenderAnalysisTableCell
            isCode
            value={JSON.stringify(row.original.output.data, null, 2)}
          />
        );
      },
    },
    ...tagsColumns,
    {
      id: ANALYSIS_TABLE_COL_ID.response,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.response,
      aggregationFn: aggregationFns.response ?? 'auto',
      header: 'O:Response',
      size: COLUMN_SIZE.LARGE,
      cell: ({ cell, row }) => {
        return <RenderAnalysisTableCell value={row.original.output.message} />;
      },
    },
    {
      id: ANALYSIS_TABLE_COL_ID.responseData,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.data,
      aggregationFn: aggregationFns.data ?? 'auto',
      header: 'O:Data',
      size: COLUMN_SIZE.MEDIUM,
      cell: ({ cell, row }) => {
        return (
          <RenderAnalysisTableCell
            isCode
            value={JSON.stringify(row.original.output.data, null, 2)}
          />
        );
      },
    },
    ...metricsColumns,
    {
      id: ANALYSIS_TABLE_COL_ID.conversationId,
      size: COLUMN_SIZE.SMALL,
      accessorKey: EVAL_RESULT_ACCESSOR_KEYS.conversationId,
      aggregationFn: aggregationFns.conversationId ?? 'auto',
      header: 'Conversation ID',
    },
  ];
  return columns;
};
