import { Span, SpanStatusCode } from '@opentelemetry/api';
import { PalicoAPIServer } from '..';
import { APIError } from '../../errors';

export const getAgentById = (id: string) => {
  const agent = PalicoAPIServer.getInstance().app.agents.find(
    (agent) => agent.id === id
  );
  if (!agent) {
    throw APIError.notFound(`Agent with id ${id} not found`);
  }
  return agent;
};

export interface RecordRequestErrorSpanOptions {
  keepSpanOpen?: boolean;
}

export const recordRequestErrorSpan = (
  error: unknown,
  span: Span,
  options: RecordRequestErrorSpanOptions = {
    keepSpanOpen: false,
  }
) => {
  const err =
    error instanceof Error
      ? error
      : new Error('Unknown non-Error error\n' + error);
  span.recordException(err);
  span.setStatus({
    code: SpanStatusCode.ERROR,
    message: err.message,
  });
  if (!options.keepSpanOpen) {
    span.end();
  }
};
