import { OpenAIMessage } from '@palico-ai/common'
import { ChatCompletionTool } from 'openai/resources'

export interface CreateConversationParams {
  tools: ChatCompletionTool[]
  history: OpenAIMessage[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
}

export interface ConversationModel {
  id: number
  history: OpenAIMessage[]
  tools: ChatCompletionTool[]
  createdAt: string
  updatedAt: string
}

export type UpdatableConversationModel = Omit<Partial<ConversationModel>, | 'createdAt' | 'updatedAt'>

export interface ConversationService {
  create: (params: CreateConversationParams) => Promise<ConversationModel>
  findById: (id: number) => Promise<ConversationModel | undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getConversationMetadata: (id: number) => Promise<Record<string, any> | undefined>
  update: (conversation: Partial<UpdatableConversationModel>) => Promise<void>
}

export interface StorageService {
  conversation: ConversationService
}
