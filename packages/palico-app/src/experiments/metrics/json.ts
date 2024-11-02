import {
  AgentRequestContent,
  AgentResponse,
  EvalMetric,
  EvalMetricOutput,
} from '@palico-ai/common';
import { ZodSchema } from 'zod';
import { EvalMetricCommonParams } from './common';

export interface ValidJSONMetricParams extends EvalMetricCommonParams {
  schema?: ZodSchema;
  responseKey?: keyof Pick<AgentResponse, 'data' | 'message'>;
}

/**
 * Creates an EvalMetric that checks if the response is a valid JSON.
 * Returns 0 if the response is not valid JSON, 1 if it is.
 */
export function validJSONMetric(params: ValidJSONMetricParams): EvalMetric {
  return {
    label: params.label ?? 'Valid JSON',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      try {
        let json = response.data;
        if (params.responseKey === 'message') {
          if (!response.message) {
            return {
              score: 0,
            };
          }
          json = JSON.parse(response.message);
        }
        if (params.schema) {
          await params.schema.parseAsync(json);
        }
        return {
          score: 1,
        };
      } catch {
        return {
          score: 0,
        };
      }
    },
  };
}
