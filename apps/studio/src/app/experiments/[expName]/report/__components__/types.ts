import { EvalCompositeKey, Evaluation } from '@palico-ai/common';
import { AggregationFnOption, TableState } from '@tanstack/react-table';
import { EvalTestCaseWithDatasetLabel } from './row/table/types';

export enum NotebookWidgetType {
  Empty = 'empty',
  Table = 'table',
  Text = 'text',
}

export interface EmptyNotebookWidget {
  type: NotebookWidgetType.Empty;
}

export type TableNotebookWidgetColumnAggregatorFNMap = Record<
  string,
  AggregationFnOption<EvalTestCaseWithDatasetLabel>
>;

export interface TableNotebookWidget {
  type: NotebookWidgetType.Table;
  data: {
    tableState: Partial<TableState>;
    columnAggregationFn: TableNotebookWidgetColumnAggregatorFNMap;
  };
}

export interface TextboxNotebookWidget {
  type: NotebookWidgetType.Text;
  data: {
    text: string;
  };
}

export type NotebookWidget =
  | EmptyNotebookWidget
  | TableNotebookWidget
  | TextboxNotebookWidget;

export interface DatasetMetadata extends EvalCompositeKey {
  label: string;
}

export interface Dataset extends DatasetMetadata {
  data: Omit<Evaluation, 'experimentName' | 'evalName'>;
}
