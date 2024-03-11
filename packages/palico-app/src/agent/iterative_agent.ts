import OpenAIConversationThread, { type ToolExecutionMessage } from '../llm/openai'
import { TagLogger } from '../utils/logger'
import { type ModelConfig, type Tool, type PromptBuilder } from '../app/types'
import { type ChatCompletionTool } from 'openai/resources'
import zodToJsonSchema from 'zod-to-json-schema'
import { type ConversationService } from '../storage/types'
import type OpenAI from 'openai'

export interface AgentCallResponse {
  finishReason: OpenAI.Chat.ChatCompletion.Choice['finish_reason']
  message: AgentMessage
}

export interface AgentMessage {
  role: OpenAI.Chat.ChatCompletionMessageParam['role']
  content: OpenAI.Chat.ChatCompletionMessageParam['content']
  toolCalls?: OpenAI.Chat.ChatCompletionMessage['tool_calls']
}

export type AgentResponse = AgentCallResponse & {
  conversationId: number
}

export interface ReplyAsUserParams {
  message: string
  context?: Record<string, unknown>
}

export interface ReplyAsToolParams {
  toolOutputs: ToolExecutionMessage[]
}

interface AgentCurrentStateParams {
  promptBuilder: PromptBuilder
  tools: Tool[]
  modelConfig: ModelConfig
  conversationService: ConversationService
  conversationId?: number
}

export interface Agent {
  replyAsUser: (params: ReplyAsUserParams) => Promise<AgentResponse>
  replyWithToolOutputs: (params: ReplyAsToolParams) => Promise<AgentResponse>
}

// const testTools = GetTrelloOpenAITools()

/**
 * Manages conversations, building prompts, running tools, resuming and pausing execution.
 */
export class IterativeAgent implements Agent {
  private static readonly logger = new TagLogger(IterativeAgent.name)
  readonly promptBuilder: PromptBuilder
  conversationId?: number
  readonly tools: ChatCompletionTool[]
  readonly modelConfig: ModelConfig
  private readonly conversationService: ConversationService

  // TODO: Add support for different models
  constructor (params: AgentCurrentStateParams) {
    this.conversationId = params.conversationId
    this.promptBuilder = params.promptBuilder
    this.tools = IterativeAgent.getTools(params.tools)
    this.modelConfig = params.modelConfig
    this.conversationService = params.conversationService
  }

  private static getTools (tools: Tool[]): ChatCompletionTool[] {
    const toolset: ChatCompletionTool[] = tools.map((tool) => {
      return {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.input ? zodToJsonSchema(tool.input) : undefined
        }
      }
    }) ?? []
    return toolset
  }

  private async startConversation (options: ReplyAsUserParams): Promise<AgentResponse> {
    const systemMessage = await this.promptBuilder.getSystemPrompt({
      context: options.context ?? {}
    })
    const userQuery = await this.promptBuilder.getPromptForQuery(options.message, {
      context: options.context ?? {}
    })
    const llm = new OpenAIConversationThread({
      // tools: testTools,
      tools: this.tools,
      model: this.modelConfig.model,
      openaiApiKey: this.modelConfig.openaiApiKey,
      history: [
        {
          role: 'system',
          content: systemMessage
        }
      ]
    })
    const response = await llm.sendUserMessage(userQuery)
    const conversation = await this.conversationService.create({
      tools: this.tools,
      history: llm.history
    })
    this.conversationId = conversation.id
    return {
      ...response,
      conversationId: conversation.id
    }
  }

  private async replyAsUserToConversation (params: ReplyAsUserParams): Promise<AgentResponse> {
    const { message, context } = params
    if (!this.conversationId) {
      throw new Error('Conversation ID not set')
    }
    const conversation = await this.conversationService.findById(this.conversationId)
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    const prompt = await this.promptBuilder.getPromptForQuery(message, {
      context: context ?? {}
    })
    const llm = new OpenAIConversationThread({
      model: this.modelConfig.model,
      openaiApiKey: this.modelConfig.openaiApiKey,
      tools: this.tools,
      history: conversation.history
    })
    const response = await llm.sendUserMessage(prompt)
    await this.conversationService.update({
      ...conversation,
      history: llm.history
    })
    return {
      ...response,
      conversationId: this.conversationId
    }
  }

  async replyAsUser (params: ReplyAsUserParams): Promise<AgentResponse> {
    if (!this.conversationId) {
      return await this.startConversation(params)
    }
    return await this.replyAsUserToConversation(params)
  }

  async replyWithToolOutputs (params: ReplyAsToolParams): Promise<AgentResponse> {
    IterativeAgent.logger.log('replyWithToolOutputs')
    if (!this.conversationId) {
      throw new Error('Conversation ID not set. Cannot reply with tool outputs')
    }
    const { toolOutputs } = params
    const conversation = await this.conversationService.findById(this.conversationId)
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    const llm = new OpenAIConversationThread({
      tools: this.tools,
      model: this.modelConfig.model,
      openaiApiKey: this.modelConfig.openaiApiKey,
      history: conversation.history
    })
    const response = await llm.sendToolExecutionOutputs(toolOutputs)
    await this.conversationService.update({
      ...conversation,
      history: llm.history
    })
    return {
      ...response,
      conversationId: this.conversationId
    }
  }
}
