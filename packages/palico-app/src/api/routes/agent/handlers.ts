import { trace } from '@opentelemetry/api';
import { RequestHandler } from 'express';
import { recordRequestErrorSpan } from '../../../utils/api';
import { Agent } from '../../../agent';
import {
  AgentConversationAPIRequestBody,
  AgentConversationAPIRequestResponse,
  AgentResponse,
} from '@palico-ai/common';

const tracer = trace.getTracer('agent-route-handler');

interface AgentConversationRouteParams {
  agentName: string;
}

interface AgentContinueConversationRouteParams
  extends AgentConversationRouteParams {
  conversationId: string;
}

export const newConversationRequestHandler: RequestHandler<
  AgentConversationRouteParams,
  AgentConversationAPIRequestResponse,
  AgentConversationAPIRequestBody
> = async (req, res, next) => {
  return await tracer.startActiveSpan(
    '(POST) /agent/:agentId/conversation',
    async (requestSpan) => {
      const { agentName } = req.params;
      const { content, appConfig } = req.body;
      requestSpan.setAttributes({
        agentName,
        body: JSON.stringify(req.body, null, 2),
      });
      try {
        let streamUsed = false;
        const agentResponse = await Agent.chat({
          agentName,
          content,
          appConfig: appConfig ?? {},
          onStreamContentPush: (content) => {
            if (!streamUsed) {
              streamUsed = true;
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
              });
            }
            res.write(JSON.stringify(content));
          },
        });
        if (streamUsed) {
          return res.end();
        }
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
        const { content, appConfig } = req.body;
        requestSpan.setAttributes({
          agentName,
          conversationId,
          body: JSON.stringify(req.body, null, 2),
        });
        console.log('Calling Application.chat');
        const agentResponse = await Agent.chat({
          conversationId,
          agentName,
          content,
          appConfig: appConfig ?? {},
        });
        const responseJSON: AgentResponse = {
          ...agentResponse,
          conversationId,
        };
        console.log('Returning response', responseJSON);
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
