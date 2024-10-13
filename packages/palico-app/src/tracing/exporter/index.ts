import { ExportResult, hrTimeToMilliseconds } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { InternalSpanAttribute } from '../internal.span';
import { RequestSpan } from '@palico-ai/common';
import { ConversationTelemetryModel } from '../../services/database/conversation_telemetry';

export class PalicoSpanExporter implements SpanExporter {
  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void
  ): void {
    this.logSpans(spans)
      .then(() => {
        resultCallback({
          code: 0,
        });
      })
      .catch((error) => {
        console.error('Failed to export spans', error);
        resultCallback({
          code: 1,
          error,
        });
      });
  }
  shutdown(): Promise<void> {
    console.log('Shutting down PalicoSpanExporter');
    return Promise.resolve();
  }

  forceFlush?(): Promise<void> {
    console.log('Force flushing PalicoSpanExporter');
    return Promise.resolve();
  }

  private spanDetail(span: ReadableSpan) {
    return {
      name: span.name,
      id: span.spanContext().spanId,
      traceId: span.spanContext().traceId,
      parentId: span.parentSpanId,
      attributes: span.attributes,
      resource: {
        attributes: span.resource.attributes,
      },
      timestamp: hrTimeToMilliseconds(span.startTime),
      duration: hrTimeToMilliseconds(span.duration),
      status: span.status,
      events: span.events,
    };
  }

  private async logSpans(spans: ReadableSpan[]): Promise<void> {
    const spanDBEntries: RequestSpan[] = [];
    spans.forEach((span) => {
      const conversationId = span.attributes[
        InternalSpanAttribute.ConversationId
      ] as string | undefined;
      const requestId = span.attributes[InternalSpanAttribute.RequestId] as
        | string
        | undefined;
      if (!conversationId || !requestId) {
        return;
      }
      const spanDetail = this.spanDetail(span);
      spanDBEntries.push({
        spanId: spanDetail.id,
        conversationId,
        requestId,
        parentSpanId: spanDetail.parentId,
        name: spanDetail.name,
        attributes: spanDetail.attributes,
        events: spanDetail.events,
        timestamp: spanDetail.timestamp,
        duration: spanDetail.duration,
        statusCode: spanDetail.status.code,
      });
    });
    await ConversationTelemetryModel.logSpans(spanDBEntries);
  }
}
