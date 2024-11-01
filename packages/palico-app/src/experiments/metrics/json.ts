import {
  AgentRequestContent,
  AgentResponse,
  EvalMetric,
  EvalMetricOutput,
} from '@palico-ai/common';
import { ZodSchema } from 'zod';

export interface ValidJSONMetricParams {
  schema?: ZodSchema;
  responseKey?: keyof Pick<AgentResponse, 'data' | 'message'>;
}

/**
 * Creates an EvalMetric that checks if the response is a valid JSON.
 * Returns 0 if the response is not valid JSON, 1 if it is.
 */
export function createValidJSONMetric(
  params: ValidJSONMetricParams
): EvalMetric {
  return {
    label: 'valid_json',
    async evaluate(
      _: AgentRequestContent,
      response: AgentResponse
    ): Promise<EvalMetricOutput> {
      try {
        let json = response.data;
        if (params.responseKey === 'message') {
          if (!response.message) {
            return 0;
          }
          json = JSON.parse(response.message);
        }
        if (params.schema) {
          await params.schema.parseAsync(json);
        }
        return 1;
      } catch {
        return 0;
      }
    },
  };
}
