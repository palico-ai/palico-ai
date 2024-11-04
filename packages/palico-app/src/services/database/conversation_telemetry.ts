import {
  AgentRequestContent,
  RequestLogs,
  RequestSpan,
  AgentRequestTrace,
  AgentResponse,
  AgentConversationTraceWithRequest,
  ConversationTracesWithoutRequests,
  PaginationParams,
  JSONAbleObject,
} from '@palico-ai/common';
import config from '../../config';
import {
  RequestLogsTable,
  RequestSpanTableSchema,
  AgentRequestTracingTableSchema,
  AgentRequestTracingTable,
  AgentConversationTracingTable,
  RequestSpanTable,
} from './tables';

export interface LogRequestParams {
  conversationId: string;
  agentName?: string;
  workflowName?: string;
  requestId: string;
  requestInput: AgentRequestContent;
  responseOutput: AgentResponse;
  appConfig?: JSONAbleObject;
  traceId?: string;
  tracePreviewUrl?: string;
}

export class ConversationTelemetryModel {
  // TODO: Refactor to follow the new ChatRequest pattern
  static async logRequest(request: LogRequestParams): Promise<void> {
    const basePreviewURL = await config.getTraceBasePreviewURL();
    const tracePreviewUrl = request.tracePreviewUrl
      ? request.tracePreviewUrl
      : basePreviewURL
      ? `${basePreviewURL}/${request.traceId}`
      : undefined;
    let conversation = await AgentConversationTracingTable.findByPk(
      request.conversationId
    );
    if (!conversation) {
      conversation = await AgentConversationTracingTable.create({
        conversationId: request.conversationId,
        agentName: request.agentName,
        workflowName: request.workflowName,
      });
    }
    await AgentRequestTracingTable.create({
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
  ): Promise<AgentConversationTraceWithRequest> {
    const [conversation, requests] = await Promise.all([
      AgentConversationTracingTable.findByPk(conversationId),
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
  ): Promise<AgentRequestTrace[]> {
    const requests = await AgentRequestTracingTable.findAll({
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
    const conversations = await AgentConversationTracingTable.findAll({
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [['createdAt', 'DESC']],
    });
    return conversations.map((conversation) => conversation.dataValues);
  }

  static async getRequestsForConversation(conversationId: string) {
    const requests = await AgentRequestTracingTable.findAll({
      where: { conversationId },
    });
    return requests.map((request) =>
      ConversationTelemetryModel.parseRequesTraceItem(request.dataValues)
    );
  }

  static async getRequestTelemetry(
    requestId: string
  ): Promise<AgentRequestTrace> {
    const request = await AgentRequestTracingTable.findByPk(requestId);
    if (!request) {
      throw new Error('Request not found');
    }
    return ConversationTelemetryModel.parseRequesTraceItem(request.dataValues);
  }

  static async getRequestSpans(requestId: string): Promise<RequestSpan[]> {
    const spans = await RequestSpanTable.findAll({
      where: { requestId },
    });
    return spans.map((span) =>
      ConversationTelemetryModel.parseRequestSpan(span.dataValues)
    );
  }

  static async logSpans(spans: RequestSpan[]): Promise<void> {
    await RequestSpanTable.bulkCreate(
      spans.map((span) => ({
        ...span,
        attributes: JSON.stringify(span.attributes),
        events: JSON.stringify(span.events),
      }))
    );
  }

  static async saveRequestLogs(item: RequestLogs): Promise<void> {
    await RequestLogsTable.create({
      ...item,
      logs: JSON.stringify(item.logs),
    });
  }

  static async getRequestLogs(requestId: string): Promise<RequestLogs> {
    const item = await RequestLogsTable.findByPk(requestId);
    if (!item) {
      throw new Error('Logs not found');
    }
    return {
      ...item.dataValues,
      logs: JSON.parse(item?.dataValues.logs || '[]'),
    };
  }

  private static parseRequesTraceItem(
    request: AgentRequestTracingTableSchema
  ): AgentRequestTrace {
    return {
      ...request,
      requestInput: JSON.parse(request.requestInput),
      responseOutput: JSON.parse(request.responseOutput),
      appConfig: JSON.parse(request.appConfig || '{}'),
    };
  }

  private static parseRequestSpan(span: RequestSpanTableSchema): RequestSpan {
    return {
      ...span,
      attributes: JSON.parse(span.attributes),
      events: JSON.parse(span.events),
    };
  }
}
