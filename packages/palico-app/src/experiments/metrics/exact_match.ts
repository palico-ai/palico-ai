import { AgentRequestContent, AgentResponse } from '@palico-ai/common';
import { EvalMetric, EvalMetricOutput } from '../types';
import { isEqual } from 'lodash';
import { EvalMetricCommonParams } from './common';

export interface ExactMatchParams extends EvalMetricCommonParams {
  expected: Pick<AgentResponse, 'message' | 'data'>;
}

/**
 * Checks if the response is an exact match.
 * Returns 0 if the response is not an exact match, 1 if it is.
 */
export function exactMatchEvalMetric(params: ExactMatchParams): EvalMetric {
  return {
    label: params.label ?? 'Exact Match',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      if (response.message !== params.expected.message) {
        return {
          score: 0,
        };
      }
      if (!isEqual(response.data, params.expected.data)) {
        return {
          score: 0,
        };
      }
      return {
        score: 1,
      };
    },
  };
}
