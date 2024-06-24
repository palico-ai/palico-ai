import {
  ConversationRequestContent,
  ConversationResponse,
  EvalMetric,
  EvalMetricOutput,
} from '@palico-ai/common';

export interface ContainsMetricParams {
  substring: string;
}

/**
 * Checks if the response contains a substring.
 * Returns 0 if the substring is not found, 1 if it is found.
 */
export class ContainsMetric implements EvalMetric {
  private params: ContainsMetricParams;
  label = 'substring';

  constructor(params: ContainsMetricParams) {
    this.params = params;
  }

  async evaluate(
    _: ConversationRequestContent,
    response: ConversationResponse
  ): Promise<EvalMetricOutput> {
    const exists = response.message
      ?.toLocaleLowerCase()
      .includes(this.params.substring.toLowerCase());
    return exists ? 1 : 0;
  }
}

export interface ContainsAnyMetricParams {
  substrings: string[];
}

/**
 * Checks if the response contains any of the substrings.
 * Returns 0 if none of the substrings are found.
 * if found, returns 1.
 */
export class ContainsAnyMetric implements EvalMetric {
  private params: ContainsAnyMetricParams;
  label = 'contains-any';

  constructor(params: ContainsAnyMetricParams) {
    this.params = params;
  }

  async evaluate(
    _: ConversationRequestContent,
    response: ConversationResponse
  ): Promise<EvalMetricOutput> {
    const found = this.params.substrings.some((substring) =>
      response.message?.toLocaleLowerCase().includes(substring.toLowerCase())
    );
    return found ? 1 : 0;
  }
}

export interface ContainsAllMetricParams {
  substrings: string[];
}

/**
 * Checks if the response contains all of the substrings.
 * Returns 0 if any of the substrings are not found.
 * if found, returns 1.
 */
export class ContainsAllMetric implements EvalMetric {
  private params: ContainsAllMetricParams;
  label = 'contains-all';

  constructor(params: ContainsAllMetricParams) {
    this.params = params;
  }

  async evaluate(
    _: ConversationRequestContent,
    response: ConversationResponse
  ): Promise<EvalMetricOutput> {
    const found = this.params.substrings.every((substring) =>
      response.message?.toLocaleLowerCase().includes(substring.toLowerCase())
    );
    return found ? 1 : 0;
  }
}
