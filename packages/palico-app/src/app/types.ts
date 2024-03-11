import { type ZodSchema } from 'zod'
import { type ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions'

export interface IncludeStatement {
  files: string[]
  directories: string[]
}

export interface PackageConfig {
  app: {
    entryPath: string
    build: string[]
  }
  include: IncludeStatement
}

export enum ToolExecutionEnvironment {
  Client = 'client',
  Local = 'local',
}

export interface IToolSchema<InputSchema = any, OutputSchema = any> {
  name: string
  description: string
  input?: ZodSchema<InputSchema>
  output?: ZodSchema<OutputSchema>
  executionEnvironment: ToolExecutionEnvironment
}

export interface ClientToolSchema extends IToolSchema {
  executionEnvironment: ToolExecutionEnvironment.Client
}

export interface LocalToolSchema extends IToolSchema {
  executionEnvironment: ToolExecutionEnvironment.Local
  handler: (input: any) => Promise<any>
}

export type Tool = ClientToolSchema | LocalToolSchema

export interface Toolset {
  name: string
  tools: Tool[]
}

export interface PromptParamsCommon {
  context: MessageContext
}

export interface PromptBuilder {
  getSystemPrompt: (params: PromptParamsCommon) => Promise<string>
  getPromptForQuery: (query: string, params: PromptParamsCommon) => Promise<string>
}

export type MessageContext = Record<string, unknown>

export interface ModelConfig {
  model: ChatCompletionCreateParamsBase['model']
  openaiApiKey: string
}

export interface PalicoDeploymentConfig {
  id: string
  apiKey: string
}

export interface SimpleApplicationConfig extends ModelConfig {
  deployment?: PalicoDeploymentConfig
  promptBuilder: PromptBuilder
  toolset?: Toolset
}
