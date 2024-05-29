import { flattenExperimentColumns } from "../../../../utils/experiments";
import { Dataframe } from "../analysis.context";
import t1 from './t1.test.json'
import t2 from './t2.test.json'
import { ExperimentTestJSON } from "@palico-ai/common";

const test1 = t1 as ExperimentTestJSON
const test2 = t2 as unknown as ExperimentTestJSON

export const TestDataset: Dataframe[] = [
  {
    label: 'Dataset 1',
    columns: flattenExperimentColumns(test1.result),
    dataset: test1.result
  },
  {
    label: 'Dataset 2',
    columns: flattenExperimentColumns(test2.result),
    dataset: test2.result
  }
]