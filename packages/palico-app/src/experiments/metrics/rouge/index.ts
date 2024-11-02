import {
  AgentRequestContent,
  AgentResponse,
  EvalMetric,
  EvalMetricOutput,
} from '@palico-ai/common';
import rouge from './rouge';
import { EvalMetricCommonParams } from '../common';

export interface RougeMetricParams extends EvalMetricCommonParams {
  expected: string;
}

/**
 * Evaluates the ROUGE-L similarity metric for a given response.
 * This metric captures sentence-level structure and fluency,
 * reflecting the extent to which the actual value captures
 * the same semantic order as the expected.
 */
export const rougeLCSSimilarityEvalMetric = (
  params: RougeMetricParams
): EvalMetric => {
  return {
    label: params.label ?? 'Rouge-L',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      if (!response.message) {
        return {
          score: 0,
        };
      }
      const score = rouge.l(response.message, params.expected);
      return {
        score,
      };
    },
  };
};

/**
 * Evaluates the ROUGE-N similarity metric for a given response.
 * This metric assesses how well the actual result matches the expected
 * at the word and phrase levels, focusing on specific sequences.
 */
export const rougeNGramSimilarityEvalMetric = (
  params: RougeMetricParams
): EvalMetric => {
  return {
    label: params.label ?? 'Rouge-N',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      if (!response.message) {
        return {
          score: 0,
        };
      }
      const score = rouge.n(response.message, params.expected);
      return {
        score,
      };
    },
  };
};

/**
 * Evaluates the ROUGE-S similarity metric for a given response.
 * This metric captures more flexible phrase structures, reflecting
 * coherence in non-contiguous word patterns
 */
export const rougeSkipBigramSimilarityEvalMetric = (
  params: RougeMetricParams
): EvalMetric => {
  return {
    label: params.label ?? 'Rouge-S',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      if (!response.message) {
        return {
          score: 0,
        };
      }
      const score = rouge.s(response.message, params.expected);
      return {
        score,
      };
    },
  };
};
