import { OpenAI } from 'openai'
import { type ChatCompletionTool } from 'openai/resources/chat/completions'
import { TagLogger } from '../utils/logger'
import { AgentCallResponse } from '@palico-ai/common'

export type OpenAIMessage = OpenAI.Chat.ChatCompletionMessageParam & {
  function_call?: OpenAI.Chat.ChatCompletionMessage['function_call']
}

interface ConversationThreadConstructor {
  history?: OpenAIMessage[]
  tools?: ChatCompletionTool[]
  model: string
  openaiApiKey: string
}

export interface ToolExecutionMessage {
  functionName: string
  toolId: string
  output: Record<string, unknown>
}

// TODO: Create Generic LLM class
export default class OpenAIConversationThread {
  private static readonly logger = new TagLogger('OpenAIConversationThread')
  private readonly client: OpenAI
  private readonly tools?: ChatCompletionTool[]
  private readonly model: string
  private readonly openaiApiKey: string
  readonly history: OpenAIMessage[]

  constructor (params: ConversationThreadConstructor) {
    this.history = params.history ?? [
      {
        role: 'system',
        content:
          "Don't make assumptions about what values to plug into functions. Ask the user for clarification if a user request is ambiguous."
      }
    ]
    this.tools = params.tools?.length ? params.tools : undefined
    this.model = params.model
    this.openaiApiKey = params.openaiApiKey
    this.client = new OpenAI({
      apiKey: this.openaiApiKey
    })
  }

  async call (message: OpenAIMessage[]): Promise<AgentCallResponse> {
    const startTime = Date.now()
    this.history.push(...message)
    OpenAIConversationThread.logger.log('OpenAI Request History')
    OpenAIConversationThread.logger.log(this.history)
    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0,
      messages: this.history,
      stream: false,
      tools: this.tools
    })
    console.log('OpenAI Response', response)
    const elapsedTime = Date.now() - startTime
    console.log(`OpenAI Request Elapsed Time: ${elapsedTime}ms`)
    const responseChoices = response.choices[0]
    const responseMessage = response.choices[0].message
    this.history.push(responseMessage)
    return {
      finishReason: responseChoices.finish_reason,
      message: {
        role: responseMessage.role,
        content: responseMessage.content,
        toolCalls: responseMessage.tool_calls
      }
    }
  }

  async sendUserMessage (message: string): Promise<AgentCallResponse> {
    const response = await this.call([
      {
        role: 'user',
        content: message
      }
    ])
    return response
  }

  async sendToolExecutionOutputs (toolExecutionMessages: ToolExecutionMessage[]): Promise<AgentCallResponse> {
    const messages: OpenAIMessage[] = toolExecutionMessages.map((response) => {
      return {
        role: 'tool',
        tool_call_id: response.toolId,
        name: response.functionName,
        content: response.output ? JSON.stringify(response.output) : 'action completed'
      }
    })
    const response = await this.call(messages)
    return response
  }
}
