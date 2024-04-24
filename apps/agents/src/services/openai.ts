import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import ConversationHistory from "../tables/conversation_history";
import { Tracer } from "../utils/tracer";
import { AgentResponse } from "@palico-ai/common";

interface OpenAINewConversationParams {
  systemPrompt: string;
}

interface ConversationConstructorParams {
  history: ChatCompletionMessageParam[];
  conversationId?: number;
}

export type OpenAICallResponse = Omit<AgentResponse, "data">;

export class OpenAIConversation {
  private client: OpenAI;
  private history: OpenAI.Chat.ChatCompletionMessageParam[];
  private conversationId?: number;

  private constructor(params: ConversationConstructorParams) {
    const apiKey = process.env["OPENAI_API_KEY"];
    if(!apiKey) {
      throw new Error("OPENAI_API_KEY not set");
    }
    this.client = new OpenAI({
      apiKey
    })
    this.history = params.history;
    this.conversationId = params.conversationId;
  }

  private async call(messages: ChatCompletionMessageParam[]): Promise<OpenAICallResponse> {
    const newHistory = [...this.history, ...messages];
    console.log("Calling OpenAI Endpoint", newHistory)
    const response = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: newHistory,
      stream: false,
    });
    this.history = newHistory;
    if(this.conversationId) {
      await ConversationHistory.updateConversationHistory(this.conversationId, this.history);
    }else {
      const conversation = await ConversationHistory.createConversation({
        agentId: "openai",
        history: this.history
      });
      this.conversationId = conversation.id;
    }
    const responseMessage = response.choices[0].message;
    if(!responseMessage || !responseMessage.content) {
      throw new Error("No response message");
    }
    return {
      conversationId: this.conversationId,
      message: responseMessage.content,
    };
  }

  async sendUserMessage(message: string): Promise<OpenAICallResponse> {
    return this.call([
      {
        role: "user",
        content: message
      }
    ]);
  }

  static async newConversation(params: OpenAINewConversationParams): Promise<OpenAIConversation> {
    Tracer.group("OpenAI New Conversation")
    const response = new OpenAIConversation({
      history: [
        {
          role: "system",
          content: params.systemPrompt
        }
      ]
    });
    Tracer.info("Response")
    Tracer.info(response)
    Tracer.groupEnd();
    return response;
  }

  static async fromConversationId(conversationId: number): Promise<OpenAIConversation> {
    const conversation = await ConversationHistory.getConversation(conversationId);
    if(!conversation) {
      throw new Error("Conversation not found");
    }
    return new OpenAIConversation({
      history: conversation.history,
      conversationId
    });
  }
}