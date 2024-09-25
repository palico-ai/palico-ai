import * as api from '@opentelemetry/api';
import { Span } from '@opentelemetry/api';
import {
  CONVERSATION_CONTEXT_KEY,
  ConversationContextValue,
  InternalSpanAttribute,
} from './internal.span';

export { Span }; // commonly used by users to define function signatures

type TraceFunction<O> = (span: Span) => Promise<O>;

export const getActiveConversationContext = () => {
  const context = api.context.active();
  return context.getValue(CONVERSATION_CONTEXT_KEY) as
    | ConversationContextValue
    | undefined;
};

export const getTracer = (name: string) => {
  const tracer = api.trace.getTracer(name);

  async function trace<O>(name: string, fn: TraceFunction<O>) {
    const contextValue = getActiveConversationContext();

    const output = await tracer.startActiveSpan(
      name,
      {
        attributes: {
          [InternalSpanAttribute.ConversationId]: contextValue?.conversationId,
          [InternalSpanAttribute.RequestId]: contextValue?.requestId,
        },
      },
      async (span) => {
        try {
          return await fn(span);
        } finally {
          span.end();
        }
      }
    );

    return output;
  }

  return {
    trace,
  };
};
