import {
  EvalMetric,
  EvalMetricOutput,
  ConversationResponse,
  ConversationRequestContent,
} from '@palico-ai/app';

interface CreateParams {
  fact: string;
}

export class Friendlyless implements EvalMetric {
  label = 'friendlyness';
  constructor(private readonly params: CreateParams) {}

  async evaluate(
    input: ConversationRequestContent<Record<string, unknown>>,
    response: ConversationResponse<Record<string, unknown>>
  ): Promise<EvalMetricOutput> {
    // TODO: Call OpenAI API to get the friendlyness of the response
    return Math.random() > 0.5;
  }
}

export class ValidateJSONSchema implements EvalMetric {
  label = 'validate-json-schema';
  constructor(private expected: string) {}

  async evaluate(
    input: ConversationRequestContent<Record<string, unknown>>,
    response: ConversationResponse
  ): Promise<EvalMetricOutput> {
    // TODO: Validate the response against the expected JSON schema
    return false;
  }
}
