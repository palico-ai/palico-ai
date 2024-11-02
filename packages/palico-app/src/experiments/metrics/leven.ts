import { EvalMetric } from '@palico-ai/common';
import { distance } from 'fastest-levenshtein';
import { EvalMetricCommonParams } from './common';

export interface LevensteinEvalMetricParams extends EvalMetricCommonParams {
  expected: string;
}

/**
 * Returns a metric that evaluates the similarity of the response to the expected string.
 * Returns a score of 1 - (distance / expected.length)
 */
export const levensteinEvalMetric = (
  params: LevensteinEvalMetricParams
): EvalMetric => {
  return {
    label: params.label ?? 'Levenstein',
    async evaluate(_: any, response: any) {
      const score = distance(params.expected, response.message);
      return {
        score: 1 - score / params.expected.length,
      };
    },
  };
};
