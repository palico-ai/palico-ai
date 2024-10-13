import { AgentRequestContent, AgentResponse } from '@palico-ai/common';
import { EvalMetric, EvalMetricOutput } from '../types';

export interface ExactMatchParams {
  expected: Pick<AgentResponse, 'message' | 'data'>;
}

/**
 * Checks if the response is an exact match.
 * Returns 0 if the response is not an exact match, 1 if it is.
 */
export class ExactMatchMetric implements EvalMetric {
  private params: ExactMatchParams;
  label = 'Exact Match';

  constructor(params: ExactMatchParams) {
    this.params = params;
  }

  async evaluate(
    _: AgentRequestContent,
    response: AgentResponse
  ): Promise<EvalMetricOutput> {
    if (response.message !== this.params.expected.message) {
      return 0;
    }
    if (response.data !== this.params.expected.data) {
      return 0;
    }
    return 1;
  }
}
