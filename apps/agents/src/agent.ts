import {
  LLMAgent,
} from "@palico-ai/app";
import { OpenAIConversation } from "./services/openai";
import { Tracer } from "./utils/tracer";
import { AgentNewConversationParams, AgentReplyToConversationParams, AgentResponse } from "@palico-ai/common";

export type AgentResponseData = Record<string, unknown>;

export class ConversationalAgent implements LLMAgent {
  async newConversation(
    params: AgentNewConversationParams
  ): Promise<AgentResponse<AgentResponseData>> {
    Tracer.newRequest();
    Tracer.info("Calling OpenAIConversation.newConversation");
    const conversation = await OpenAIConversation.newConversation({
      systemPrompt: "You are a helpful assistant",
    });
    const response = await conversation.sendUserMessage(params.userMessage);
    Tracer.identify(response.conversationId);
    Tracer.groupEnd();
    Tracer.print()
    return response;
  }

  async replyToConversation(
    conversationId: number,
    params: AgentReplyToConversationParams
  ): Promise<AgentResponse<AgentResponseData>> {
    const conversation = await OpenAIConversation.fromConversationId(
      conversationId
    );
    console.log(params);
    if (!params.userMessage) {
      throw new Error("userMessage is required");
    }
    const response = await conversation.sendUserMessage(params.userMessage);
    return response;
  }
}
