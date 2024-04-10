import { type ModelConfig, type PromptBuilder, type Tool } from './types'
import { type StorageService } from '../storage/types'
import { type ReplyAsUserParams, IterativeAgent, type ReplyAsToolParams } from '../agent/iterative_agent'
import { AgentResponse } from '@palico-ai/common'

export interface ApplicationAPIParams {
  storage: StorageService
  promptBuilder: PromptBuilder
  tools: Tool[]
  model: ModelConfig
}

export interface ReplyAsToolRequest extends ReplyAsToolParams {
  conversationId: number
}

export interface ReplyAsUserRequest extends ReplyAsUserParams {
  conversationId?: number
}

export class Application {
  public readonly promptBuilder: PromptBuilder
  public readonly tools: Tool[]
  public readonly storage: StorageService
  public readonly model: ModelConfig

  constructor (params: ApplicationAPIParams) {
    this.promptBuilder = params.promptBuilder
    this.tools = params.tools
    this.model = params.model
    this.storage = params.storage
  }

  public async replyAsUser (params: ReplyAsUserRequest): Promise<AgentResponse> {
    const agent = new IterativeAgent({
      promptBuilder: this.promptBuilder,
      tools: this.tools,
      modelConfig: this.model,
      conversationService: this.storage.conversation,
      conversationId: params.conversationId
    })
    const response = await agent.replyAsUser(params)
    return response
  }

  public async replyAsTool (params: ReplyAsToolRequest): Promise<AgentResponse> {
    const agent = new IterativeAgent({
      promptBuilder: this.promptBuilder,
      tools: this.tools,
      modelConfig: this.model,
      conversationService: this.storage.conversation,
      conversationId: params.conversationId
    })
    const response = await agent.replyWithToolOutputs({ toolOutputs: params.toolOutputs })
    return response
  }
}
