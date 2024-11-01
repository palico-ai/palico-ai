import { AgentRequestContent, AgentResponse } from '@palico-ai/common';
import { EvalMetric, EvalMetricOutput } from '../types';
import { isEqual } from 'lodash';

export interface ExactMatchParams {
  expected: Pick<AgentResponse, 'message' | 'data'>;
}

/**
 * Checks if the response is an exact match.
 * Returns 0 if the response is not an exact match, 1 if it is.
 */
export function exactMatchEvalMetric(params: ExactMatchParams): EvalMetric {
  return {
    label: 'exact_match',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      if (response.message !== params.expected.message) {
        return 0;
      }
      if (!isEqual(response.data, params.expected.data)) {
        return 0;
      }
      return 1;
    },
  };
}
