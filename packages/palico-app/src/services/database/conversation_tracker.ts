import {
  ConversationRequestContent,
  ConversationRequestTraceItem,
  ConversationResponse,
  ConversationTraces,
  ConversationTracesWithoutRequests,
  PaginationParams,
} from '@palico-ai/common';
import config from '../../config';
import {
  ConversationRequestTraceTableSchema,
  ConversationRequestTracingTable,
  ConversationTracingTable,
} from './tables';

export interface LogRequestParams {
  conversationId: string;
  agentName?: string;
  workflowName?: string;
  requestId: string;
  requestInput: ConversationRequestContent;
  responseOutput: ConversationResponse;
  traceId: string;
  tracePreviewUrl?: string;
}

export class ConversationTracker {
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
      traceId: request.traceId,
      tracePreviewUrl,
    });
  }

  static async getTracesByConversationId(
    conversationId: string
  ): Promise<ConversationTraces> {
    const [conversation, requests] = await Promise.all([
      ConversationTracingTable.findByPk(conversationId),
      ConversationTracker.getRequestsForConversation(conversationId),
    ]);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return {
      ...conversation.dataValues,
      requests,
    };
  }

  static async getRecentTraces(
    pagination?: PaginationParams
  ): Promise<ConversationRequestTraceItem[]> {
    const requests = await ConversationRequestTracingTable.findAll({
      limit: pagination?.limit,
      offset: pagination?.offset,
    });
    return requests.map((request) =>
      ConversationTracker.parseRequesTraceItem(request.dataValues)
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
      ConversationTracker.parseRequesTraceItem(request.dataValues)
    );
  }

  private static parseRequesTraceItem(
    request: ConversationRequestTraceTableSchema
  ): ConversationRequestTraceItem {
    return {
      ...request,
      requestInput: JSON.parse(request.requestInput),
      responseOutput: JSON.parse(request.responseOutput),
    };
  }
}
