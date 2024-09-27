import {
  EvalTestCaseWithDatasetLabel,
  TableNotebookWidgetColumnAggregatorFNMap,
} from '@palico-ai/common';
import {
  ANALYSIS_TABLE_COL_ID,
  getEvalTestColumnDefFragment,
} from '../../../../../../../../../utils/evaluation';
import { Dataset } from '../../types';
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

export const createColumnDefForDatasets = (
  dataset: EvalTestCaseWithDatasetLabel[],
  aggregationFns: TableNotebookWidgetColumnAggregatorFNMap = {}
): ColumnDef<EvalTestCaseWithDatasetLabel>[] => {
  const overrides = Object.keys(aggregationFns).map((key) => ({
    id: key,
    AggregatorFn: aggregationFns[key],
  }));
  return [
    {
      id: ANALYSIS_TABLE_COL_ID.label,
      accessorKey: 'label',
      header: 'Dataset',
      size: COLUMN_SIZE.SMALL,
    },
    ...getEvalTestColumnDefFragment(dataset, overrides),
  ];
};
