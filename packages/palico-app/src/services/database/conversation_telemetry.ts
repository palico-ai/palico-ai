import {
  AppConfig,
  ConversationRequestContent,
  ConversationRequestSpan,
  ConversationRequestTelemetryItem,
  ConversationResponse,
  ConversationTelemetry,
  ConversationTracesWithoutRequests,
  PaginationParams,
} from '@palico-ai/common';
import config from '../../config';
import {
  ConversationRequestSpanTableSchema,
  ConversationRequestTraceTableSchema,
  ConversationRequestTracingTable,
  ConversationTracingTable,
  RequestSpanTable,
} from './tables';

export interface LogRequestParams {
  conversationId: string;
  agentName?: string;
  workflowName?: string;
  requestId: string;
  requestInput: ConversationRequestContent;
  responseOutput: ConversationResponse;
  appConfig?: AppConfig;
  traceId?: string;
  tracePreviewUrl?: string;
}

export class ConversationTelemetryModel {
  static async logRequest(request: LogRequestParams): Promise<void> {
    const basePreviewURL = await config.getTraceBasePreviewURL();
    const tracePreviewUrl = request.tracePreviewUrl
      ? request.tracePreviewUrl
      : basePreviewURL
      ? `${basePreviewURL}/${request.traceId}`
      : undefined;
    let conversation = await ConversationTracingTable.findByPk(
      request.conversationId
    );
    if (!conversation) {
      conversation = await ConversationTracingTable.create({
        conversationId: request.conversationId,
        agentName: request.agentName,
        workflowName: request.workflowName,
      });
    }
    await ConversationRequestTracingTable.create({
      requestId: request.requestId,
      conversationId: request.conversationId,
      requestInput: JSON.stringify(request.requestInput),
      responseOutput: JSON.stringify(request.responseOutput),
      appConfig: request.appConfig ? JSON.stringify(request.appConfig) : '{}',
      traceId: request.traceId,
      tracePreviewUrl,
    });
  }

  static async getRequestsByConversationId(
    conversationId: string
  ): Promise<ConversationTelemetry> {
    const [conversation, requests] = await Promise.all([
      ConversationTracingTable.findByPk(conversationId),
      ConversationTelemetryModel.getRequestsForConversation(conversationId),
    ]);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return {
      ...conversation.dataValues,
      requests,
    };
  }

  static async getRecentRequests(
    pagination?: PaginationParams
  ): Promise<ConversationRequestTelemetryItem[]> {
    const requests = await ConversationRequestTracingTable.findAll({
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [['createdAt', 'DESC']],
    });
    return requests.map((request) =>
      ConversationTelemetryModel.parseRequesTraceItem(request.dataValues)
    );
  }

  static async getRecentConversations(
    pagination?: PaginationParams
  ): Promise<ConversationTracesWithoutRequests[]> {
    const conversations = await ConversationTracingTable.findAll({
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [['createdAt', 'DESC']],
    });
    return conversations.map((conversation) => conversation.dataValues);
  }

  static async getRequestsForConversation(conversationId: string) {
    const requests = await ConversationRequestTracingTable.findAll({
      where: { conversationId },
    });
    return requests.map((request) =>
      ConversationTelemetryModel.parseRequesTraceItem(request.dataValues)
    );
  }

  static async getRequestTelemetry(
    requestId: string
  ): Promise<ConversationRequestTelemetryItem> {
    const request = await ConversationRequestTracingTable.findByPk(requestId);
    if (!request) {
      throw new Error('Request not found');
    }
    return ConversationTelemetryModel.parseRequesTraceItem(request.dataValues);
  }

  static async getRequestSpans(
    requestId: string
  ): Promise<ConversationRequestSpan[]> {
    const spans = await RequestSpanTable.findAll({
      where: { requestId },
    });
    return spans.map((span) =>
      ConversationTelemetryModel.parseRequestSpan(span.dataValues)
    );
  }

  static async logSpans(spans: ConversationRequestSpan[]): Promise<void> {
    await RequestSpanTable.bulkCreate(
      spans.map((span) => ({
        ...span,
        attributes: JSON.stringify(span.attributes),
        events: JSON.stringify(span.events),
      }))
    );
  }

  private static parseRequesTraceItem(
    request: ConversationRequestTraceTableSchema
  ): ConversationRequestTelemetryItem {
    return {
      ...request,
      requestInput: JSON.parse(request.requestInput),
      responseOutput: JSON.parse(request.responseOutput),
      appConfig: JSON.parse(request.appConfig || '{}'),
    };
  }

  private static parseRequestSpan(
    span: ConversationRequestSpanTableSchema
  ): ConversationRequestSpan {
    return {
      ...span,
      attributes: JSON.parse(span.attributes),
      events: JSON.parse(span.events),
    };
  }
}
