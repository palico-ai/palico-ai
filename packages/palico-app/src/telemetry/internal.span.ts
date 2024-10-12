import { Span } from '@opentelemetry/api';
import { api } from '@opentelemetry/sdk-node';
import { ReadableSpan } from '@opentelemetry/sdk-trace-node';

export const CONVERSATION_CONTEXT_KEY = api.createContextKey('conversationID');

export interface ConversationContextValue {
  conversationId: string;
  requestId: string;
}

export enum InternalSpanAttribute {
  ConversationId = 'palico.conversationId',
  RequestId = 'palico.requestId',
}

const tracer = api.trace.getTracer('tracing.internal.span');

export function startConversationSpan<F extends (span: Span) => ReturnType<F>>(
  conversationId: string,
  requestId: string,
  name: string,
  fn: F
): ReturnType<F> {
  let context = api.context.active();
  const contextValues = context.getValue(CONVERSATION_CONTEXT_KEY) as
    | ConversationContextValue
    | undefined;
  if (
    contextValues &&
    contextValues.conversationId === conversationId &&
    contextValues.requestId === requestId
  ) {
    return fn(tracer.startSpan(name));
  } else {
    const values: ConversationContextValue = {
      requestId,
      conversationId,
    };
    context = context.setValue(CONVERSATION_CONTEXT_KEY, values);
  }
  return tracer.startActiveSpan(name, {}, context, fn);
}

export function parseConversationContext(
  span: ReadableSpan
): ConversationContextValue | undefined {
  const conversationId = span.attributes[InternalSpanAttribute.ConversationId];
  const requestId = span.attributes[InternalSpanAttribute.RequestId];
  if (!conversationId || !requestId) {
    return;
  }
  return {
    conversationId: conversationId as string,
    requestId: requestId as string,
  };
}
