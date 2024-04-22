import { type ZodSchema } from 'zod';

export interface ToolCallParams {
  toolId: string;
  toolName: string;
  args: Record<string, unknown>;
}

export interface ToolCallResult {
  toolId: string;
  result: Record<string, unknown>;
}

export interface ChatCompletionOutput<Data = Record<string, unknown>> {
  conversationId: string;
  message?: string;
  toolCalls?: ToolCallParams[];
  data?: Data;
}

export interface ChatCompletionMessageInput {
  userMessage: string;
  context?: Record<string, unknown>;
}

export interface ChatCompletionToolCallInput {
  toolOutputs: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export type ReplyToConversationParams = {
  conversationId: string;
  userMessage?: string;
  toolOutputs?: Record<string, unknown>;
}

export interface ILLMAgent {
  newConversation: (
    params: ChatCompletionMessageInput
  ) => Promise<ChatCompletionOutput>;
  replyToConversation: (
    conversationId: string,
    params: ReplyToConversationParams
  ) => Promise<ChatCompletionOutput>;
}

export interface AddAgentParams {
  agent: ILLMAgent;
  route: string;
}

// TODO: Figure out how to handle tool execution
// TODO: Figure out how experiments will be ran in a centralized way in web console
export class AgentResource {
  agent: ILLMAgent;
  route: string;
  templateSchemas: Record<string, ZodSchema> = {};

  constructor(agent: ILLMAgent, route: string) {
    this.agent = agent;
    this.route = route;
  }

  addContextTemplate(name: string, zodSchema: ZodSchema) {
    console.log('Context schema added');
  }
}

export class PalicoApp {
  agentResources: AgentResource[] = [];

  constructor() {
    console.log('PalicoApp created');
  }

  addAgent(params: AddAgentParams): AgentResource {
    const agentResource = new AgentResource(params.agent, params.route);
    this.agentResources.push(agentResource);
    return agentResource;
  }
}
