import { Span, SpanStatusCode } from '@opentelemetry/api';

export interface RecordRequestErrorSpanOptions {
  keepSpanOpen?: boolean;
}

export const recordRequestErrorSpan = (
  error: unknown,
  span: Span,
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
};
