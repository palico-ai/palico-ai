import { EvalMetric, EvalMetricOutput, EvalTestCase } from '@palico-ai/common';

export type TestDatasetFN = () => Promise<EvalTestCase[]>;

export interface CreateTestFromDatasetParams<DatasetItemSchema> {
  fetchDataset: () => Promise<DatasetItemSchema[]>;
  testCase: (item: DatasetItemSchema) => EvalTestCase;
}

export const testFromDataset = <DatasetItemSchema>(
  params: CreateTestFromDatasetParams<DatasetItemSchema>
): TestDatasetFN => {
  return async () => {
    const dataset = await params.fetchDataset();
    return dataset.map(params.testCase);
  };
};

export const evaluate = (
  label: string,
  evaluateFn: () => Promise<EvalMetricOutput>
): EvalMetric => {
  return {
    label,
    evaluate: evaluateFn,
  };
};
