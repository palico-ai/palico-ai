import { trace } from '@opentelemetry/api';
import { RequestHandler, Response } from 'express';
import { recordRequestErrorSpan } from '../../../utils/api';
import { Agent, AgentChatRequest } from '../../../agent';
import {
  AgentConversationAPIRequestBody,
  AgentConversationAPIRequestResponse,
  AgentResponse,
  AgentResponseChunk,
} from '@palico-ai/common';

const tracer = trace.getTracer('agent-route-handler');

interface AgentConversationRouteParams {
  agentName: string;
}

interface AgentContinueConversationRouteParams
  extends AgentConversationRouteParams {
  conversationId: string;
}

const handleStreamResponse = async (
  res: Response,
  chatParams: AgentChatRequest
) => {
  // if the agent does not use the stream, this will stay false
  // in which case we will stream the response as a single chunk
  let agentUsedStream = false;
  const handlePushContent = (content: AgentResponseChunk) => {
    const firstEntry = agentUsedStream === false;
    if (firstEntry) {
      agentUsedStream = true;
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
    }
    res.write(
      firstEntry ? `${JSON.stringify(content)}` : `\n${JSON.stringify(content)}`
    );
  };
  const agentResponse = await Agent.chat({
    ...chatParams,
    onStreamContentPush: handlePushContent,
  });
  if (agentUsedStream) {
    return res.end();
  }
  handlePushContent({
    conversationId: agentResponse.conversationId,
    requestId: agentResponse.requestId,
    delta: {
      message: agentResponse.message,
      data: agentResponse.data,
      intermediateSteps: agentResponse.intermediateSteps,
      toolCalls: agentResponse.toolCalls,
    },
  });
  return res.end();
};

export const newConversationRequestHandler: RequestHandler<
  AgentConversationRouteParams,
  AgentConversationAPIRequestResponse,
  AgentConversationAPIRequestBody
> = async (req, res, next) => {
  return await tracer.startActiveSpan(
    '(POST) /agent/:agentId/conversation',
    async (requestSpan) => {
      const { agentName } = req.params;
      const { content, appConfig, stream } = req.body;
      requestSpan.setAttributes({
        agentName,
        stream,
        body: JSON.stringify(req.body, null, 2),
      });
      try {
        if (stream) {
          return await handleStreamResponse(res, {
            agentName,
            userMessage: content.userMessage,
            payload: content.payload,
            toolCallResults: content.toolCallResults,
            appConfig: appConfig ?? {},
          });
        }
        const agentResponse = await Agent.chat({
          agentName,
          userMessage: content.userMessage,
          payload: content.payload,
          toolCallResults: content.toolCallResults,
          appConfig: appConfig ?? {},
        });
        return res.status(200).json(agentResponse);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
      }
    }
  );
};

export const replyToConversationRequestHandler: RequestHandler<
  AgentContinueConversationRouteParams,
  AgentConversationAPIRequestResponse,
  AgentConversationAPIRequestBody
> = async (req, res, next) => {
  return await tracer.startActiveSpan(
    '(POST) /agent/:agentId/conversation',
    async (requestSpan) => {
      try {
        const { conversationId, agentName } = req.params;
        const { content, appConfig, stream } = req.body;
        requestSpan.setAttributes({
          agentName,
          conversationId,
          stream,
          body: JSON.stringify(req.body, null, 2),
        });
        if (stream) {
          return await handleStreamResponse(res, {
            conversationId,
            agentName,
            userMessage: content.userMessage,
            toolCallResults: content.toolCallResults,
            payload: content.payload,
            appConfig: appConfig ?? {},
          });
        }
        const agentResponse = await Agent.chat({
          conversationId,
          agentName,
          userMessage: content.userMessage,
          toolCallResults: content.toolCallResults,
          payload: content.payload,
          appConfig: appConfig ?? {},
        });
        const responseJSON: AgentResponse = {
          ...agentResponse,
          conversationId,
        };
        return res.status(200).json(responseJSON);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
      }
    }
  );
};
