import { EvalTestCaseResult } from '@palico-ai/common';

export interface EvalTestCaseWithDatasetLabel extends EvalTestCaseResult {
  label: string;
}
