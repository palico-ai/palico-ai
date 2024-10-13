import {
  AgentRequestContext,
  AgentRequestContent,
  AgentResponse,
  JSONAbleObject,
} from '@palico-ai/common';

export type AgentChatOutput<Data extends JSONAbleObject = JSONAbleObject> =
  Omit<AgentResponse<Data>, 'conversationId' | 'requestId'>;

export abstract class Agent<
  InputPayload extends JSONAbleObject = JSONAbleObject,
  OutputData extends JSONAbleObject = JSONAbleObject,
  AC extends JSONAbleObject = JSONAbleObject
> {
  abstract chat(
    content: AgentRequestContent<InputPayload>,
    context: AgentRequestContext<AC>
  ): Promise<AgentChatOutput<OutputData>>;
}

export { AgentRequestContent, AgentRequestContext, AgentResponse };
