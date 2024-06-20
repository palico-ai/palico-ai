import {
  ConversationContext,
  ConversationRequestContent,
  LLMAgent,
  LLMAgentResponse,
} from "@palico-ai/app";
import { OpenAIService } from "../../utils/openai";

export interface FeatureFlag {
  model?: "gpt35" | "gpt35-turbo" | "gpt4" | "gpt4o";
}

class ChatbotAgent implements LLMAgent {
  static readonly NAME: string = __dirname.split("/").pop()!;

  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<LLMAgentResponse> {
    const { userMessage } = content;
    if (!userMessage) throw new Error("User message is required");
    const { conversationId, featureFlags, isNewConversation } = context;
    const { model } = featureFlags as FeatureFlag;
    if (isNewConversation) {
      const response = await OpenAIService.newConversation({
        conversationId,
        message: userMessage,
        model: ChatbotAgent.getModelName(model),
      });
      return response;
    } else {
      const response = await OpenAIService.replyToConversation({
        conversationId,
        message: userMessage,
        model: ChatbotAgent.getModelName(model),
      });
      return response;
    }
  }

  private static getModelName(model?: string): string {
    switch (model) {
      case "gpt35":
        return "gpt-3.5-turbo-0125";
      case "gpt35-turbo":
        return "gpt-3.5-turbo-0125";
      case "gpt4":
        return "gpt-4-turbo";
      case "gpt4o":
        return "gpt-4o";
      default:
        return "gpt-3.5-turbo-0125";
    }
  }
}

export default ChatbotAgent;
