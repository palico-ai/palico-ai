import {
  AppConfig,
  ChatRequestContent,
  RequestLogs,
  ConversationRequestSpan,
  ConversationRequestItem,
  ConversationResponse,
  ConversationTraceWithRequests,
  ConversationTraceWithoutRequests,
  PaginationParams,
  JSONAbleObject,
} from '@palico-ai/common';
import config from '../config';
import {
  RequestLogsTable,
  ConversationRequestSpanTableSchema,
  ConversationRequestTableSchema,
  ConversationRequestTable,
  ConversationTraceTable,
  RequestSpanTable,
} from '../services/database/tables';

export interface LogRequestParams<
  Input = JSONAbleObject,
  Output = JSONAbleObject
> {
  conversationId: string;
  agentName?: string;
  workflowName?: string;
  requestId: string;
  requestInput: Input;
  responseOutput: Output;
  appConfig?: AppConfig;
  traceId?: string; // @deprecated
  tracePreviewUrl?: string; // @deprecated
}

export class ConversationTraceModel {
  static async logRequest(request: LogRequestParams): Promise<void> {
    const basePreviewURL = await config.getTraceBasePreviewURL();
    const tracePreviewUrl = request.tracePreviewUrl
      ? request.tracePreviewUrl
      : basePreviewURL
      ? `${basePreviewURL}/${request.traceId}`
      : undefined;
    let conversation = await ConversationTraceTable.findByPk(
      request.conversationId
    );
    if (!conversation) {
      conversation = await ConversationTraceTable.create({
        conversationId: request.conversationId,
        agentName: request.agentName,
        workflowName: request.workflowName,
      });
    }
    await ConversationRequestTable.create({
      requestId: request.requestId,
      conversationId: request.conversationId,
      requestInput: JSON.stringify(request.requestInput),
      responseOutput: JSON.stringify(request.responseOutput),
      appConfig: request.appConfig ? JSON.stringify(request.appConfig) : '{}',
      traceId: request.traceId,
      tracePreviewUrl,
    });
  }

  static async getRecentRequestList(
    pagination?: PaginationParams
  ): Promise<ConversationRequestItem[]> {
    const requests = await ConversationRequestTable.findAll({
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [['createdAt', 'DESC']],
    });
    return requests.map((request) =>
      ConversationTraceModel.parseRequestTableData(request.dataValues)
    );
  }

  static async getRecentRequestsForWorkflow(
    workflowName: string,
    pagination?: PaginationParams
  ): Promise<ConversationRequestItem[]> {
    const requests = await ConversationRequestTable.findAll({
      include: [
        {
          model: ConversationTraceTable,
          where: { workflowName },
        },
      ],
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [['createdAt', 'DESC']],
    });
    return requests.map((request) =>
      ConversationTraceModel.parseRequestTableData(request.dataValues)
    );
  }

  static async getRecentConversationList(
    pagination?: PaginationParams
  ): Promise<ConversationTraceWithoutRequests[]> {
    const conversations = await ConversationTraceTable.findAll({
      limit: pagination?.limit,
      offset: pagination?.offset,
      order: [['createdAt', 'DESC']],
    });
    return conversations.map((conversation) => conversation.dataValues);
  }

  static async getConversationWithRequestList(
    conversationId: string
  ): Promise<ConversationTraceWithRequests> {
    const [conversation, requests] = await Promise.all([
      ConversationTraceTable.findByPk(conversationId),
      ConversationTraceModel.getRequestList(conversationId),
    ]);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return {
      ...conversation.dataValues,
      requests,
    };
  }

  static async getRequestList(
    conversationId: string
  ): Promise<ConversationRequestItem[]> {
    const requests = await ConversationRequestTable.findAll({
      where: { conversationId },
    });
    return requests.map((request) =>
      ConversationTraceModel.parseRequestTableData(request.dataValues)
    );
  }

  static async getRequest(requestId: string): Promise<ConversationRequestItem> {
    const request = await ConversationRequestTable.findByPk(requestId);
    if (!request) {
      throw new Error('Request not found');
    }
    return ConversationTraceModel.parseRequestTableData(request.dataValues);
  }

  static async getRequestSpanList(
    requestId: string
  ): Promise<ConversationRequestSpan[]> {
    const spans = await RequestSpanTable.findAll({
      where: { requestId },
    });
    return spans.map((span) =>
      ConversationTraceModel.parseSpanTableData(span.dataValues)
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

  private static parseRequestTableData(
    request: ConversationRequestTableSchema
  ): ConversationRequestItem {
    return {
      ...request,
      requestInput: JSON.parse(request.requestInput),
      responseOutput: JSON.parse(request.responseOutput),
      appConfig: JSON.parse(request.appConfig || '{}'),
    };
  }

  private static parseSpanTableData(
    span: ConversationRequestSpanTableSchema
  ): ConversationRequestSpan {
    return {
      ...span,
      attributes: JSON.parse(span.attributes),
      events: JSON.parse(span.events),
    };
  }
}
