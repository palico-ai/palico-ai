import {
  AgentRequestContent,
  AgentResponse,
  EvalMetric,
  EvalMetricOutput,
} from '@palico-ai/common';
import { EvalMetricCommonParams } from './common';

export interface ContainsMetricParams extends EvalMetricCommonParams {
  substring: string;
}

/**
 * Checks if the response contains a substring.
 * Returns 0 if the substring is not found, 1 if it is found.
 */
export function containsEvalMetric(params: ContainsMetricParams): EvalMetric {
  return {
    label: params.label ?? 'Contains',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      const exists = response.message
        ?.toLocaleLowerCase()
        .includes(params.substring.toLowerCase());
      return {
        score: exists ? 1 : 0,
      };
    },
  };
}

export interface ContainsAnyMetricParams extends EvalMetricCommonParams {
  substrings: string[];
}

/**
 * Checks if the response contains any of the substrings.
 * Returns 0 if none of the substrings are found.
 * if found, returns 1.
 */
export function containsAnyEvalMetric(
  params: ContainsAnyMetricParams
): EvalMetric {
  return {
    label: params.label ?? 'Contains Any',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      const found = params.substrings.some((substring) =>
        response.message?.toLocaleLowerCase().includes(substring.toLowerCase())
      );
      return {
        score: found ? 1 : 0,
      };
    },
  };
}

export interface ContainsAllMetricParams extends EvalMetricCommonParams {
  substrings: string[];
}

/**
 * Checks if the response contains all of the substrings.
 * Returns 0 if any of the substrings are not found.
 * if found, returns 1.
 */
export function containsAllEvalMetric(
  params: ContainsAllMetricParams
): EvalMetric {
  return {
    label: params.label ?? 'Contains All',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      const found = params.substrings.every((substring) =>
        response.message?.toLocaleLowerCase().includes(substring.toLowerCase())
      );
      return {
        score: found ? 1 : 0,
      };
    },
  };
}
