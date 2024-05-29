import { Dataframe } from '../analysis.context';
import t1 from './t1.test.json';
import t2 from './t2.test.json';
import { ExperimentTestJSON } from '@palico-ai/common';

const test1 = t1 as ExperimentTestJSON;
const test2 = t2 as unknown as ExperimentTestJSON;

export const TestDataset: Dataframe[] = [
  {
    label: 'Experiment 1',
    dataset: test1.result.map((result) => ({
      ...result,
      experimentName: 'exp1',
      testName: 'test1',
    }))
  },
  {
    label: 'Experiment 2',
    dataset: [
      ...test2.result.map((result) => ({
        ...result,
        experimentName: 'exp2',
        testName: 'test2',
      })),
      ...test2.result.map((result) => ({
        ...result,
        experimentName: 'exp2',
        testName: 'test1',
      }))
    ]
  },
];
