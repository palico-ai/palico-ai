import { type ChatCompletionMessageToolCall } from 'openai/resources'
import { useEffect, useMemo, useState } from 'react'
import { type ChatMessage, type ToolHandler } from '.'
import { type AgentRequestHandler, AgentRequestType, type ToolExecutionMessage, type AgentCallResponse } from '@palico-ai/client-js'

// TODO: Refactor this to be more readable and less error-prone

interface MessageHandlerParams {
  requestHandler: AgentRequestHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: Record<string, ToolHandler<any, any>>
}

interface MessageHandlerOutput {
  sendMessage: (message: string, context: Record<string, unknown>) => Promise<void>
  messageHistory: ChatMessage[]
  loading: boolean
}

enum TaskType {
  // Will check if conversation exists or not and create a new one. Will send message to anget
  ReviewPendingMessage,
  HandleAgentResponse, // Will review agent response. If string message, update message history. If tool call, add new task
  CallTool, // Will call tool and store output
  ReplyToToolCall, // Will send tool output to agent
}

interface Task<Payload> {
  type: TaskType
  payload: Payload
}

interface ReviewPendingMessageTask
  extends Task<{
    message: string
    context: Record<string, unknown>
  }> {
  type: TaskType.ReviewPendingMessage
}

interface HandleAgentResponseTask extends Task<AgentCallResponse> {
  type: TaskType.HandleAgentResponse
}

interface CallToolTask extends Task<ChatCompletionMessageToolCall> {
  type: TaskType.CallTool
}

interface ReplyToToolCallTask extends Task<undefined> {
  type: TaskType.ReplyToToolCall
}

type MessageHandlerTask =
  | ReviewPendingMessageTask
  | HandleAgentResponseTask
  | CallToolTask
  | ReplyToToolCallTask

const useSendMessage = (params: MessageHandlerParams): MessageHandlerOutput => {
  const { requestHandler } = params
  const [taskStack, setTaskStack] = useState<MessageHandlerTask[]>([])
  const [activeTask, setActiveTask] = useState<MessageHandlerTask>()
  const [toolExecutionMessages, setToolExecutionMessages] = useState<ToolExecutionMessage[]>([])
  const [messageHistory, setMessageHistory] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<number>()

  useEffect(() => {
    console.log('useSendMessage')
    let isMounted = true

    const handleReviewPendingMessageTask = async (
      task: ReviewPendingMessageTask
    ): Promise<void> => {
      console.log('handleReviewPendingMessageTask')
      if (!isMounted) {
        console.log('handleReviewPendingMessageTask not mounted')
        return
      }
      let response: AgentCallResponse
      const { message, context } = task.payload
      console.log(task)
      if (!conversationId) {
        console.log('conversationId not found')
        response = await requestHandler({
          type: AgentRequestType.NewConversation,
          payload: {
            message,
            context
          }
        })
        setConversationId(response.conversationId)
      } else {
        console.log('conversationId found')
        response = await requestHandler({
          type: AgentRequestType.ReplyAsUser,
          payload: {
            conversationId,
            message,
            context
          }
        })
      }
      console.log('handleReviewPendingMessageTask response', response)
      setTaskStack((current) => [
        ...current,
        {
          type: TaskType.HandleAgentResponse,
          payload: response
        }
      ])
    }

    const handleAgentResponseTask = async (
      task: HandleAgentResponseTask
    ): Promise<void> => {
      console.log('handleAgentResponseTask')
      console.log(task)
      if (!isMounted) {
        console.log('handleAgentResponseTask not mounted')
        return
      }
      const { message } = task.payload
      if (message.content) {
        console.log('message content found')
        setMessageHistory([
          ...messageHistory,
          {
            content: message.content.toString(),
            role: 'assistant'
          }
        ])
      } else if (message.toolCalls) {
        console.log('message tool calls found')
        const toolCallTasks: CallToolTask[] = message.toolCalls.map((toolCall) => ({
          type: TaskType.CallTool,
          payload: toolCall
        }))
        setTaskStack((current) => [
          ...current,
          ...toolCallTasks
        ])
        console.log('tool call tasks added to stack')
      } else {
        throw new Error('Invalid response')
      }
    }

    const handleCallToolTask = async (
      task: CallToolTask
    ): Promise<void> => {
      console.log('handleCallToolTask')
      if (!isMounted) {
        console.log('handleCallToolTask not mounted')
        return
      }
      const {
        id, function: {
          name,
          arguments: args
        }
      } = task.payload
      console.log(params.tools)
      const toolHandler = params.tools[name]
      if (!toolHandler) {
        throw new Error(`Tool ${name} not found`)
      }
      console.log('calling tool handler')
      const toolOutput = await toolHandler(JSON.parse(args))
      console.log('tool handler output', toolOutput)
      const toolExecutionMessage: ToolExecutionMessage = {
        toolId: id,
        functionName: name,
        output: toolOutput ?? 'Action completed'
      }
      setToolExecutionMessages((current) => [
        ...current,
        toolExecutionMessage
      ])
      setTaskStack((current) => {
        const newTaskStack = [...current]
        const nextTask = newTaskStack[newTaskStack.length - 1]
        if (nextTask === undefined || nextTask.type !== TaskType.CallTool) {
          newTaskStack.push({
            type: TaskType.ReplyToToolCall,
            payload: undefined
          })
        }
        return newTaskStack
      })
    }

    const handleReplyToToolCallTask = async (): Promise<void> => {
      console.log('handleReplyToToolCallTask')
      if (!isMounted) {
        console.log('handleReplyToToolCallTask not mounted')
        return
      }
      if (!conversationId) {
        throw new Error('Conversation ID not found')
      }
      console.log('Replying to tool call')
      const agentResponse = await requestHandler({
        type: AgentRequestType.ReplyAsTool,
        payload: {
          conversationId,
          toolOutputs: toolExecutionMessages
        }
      })
      console.log('agent response', agentResponse)
      setToolExecutionMessages([])
      setTaskStack((current) => {
        const newTaskStack = [...current]
        newTaskStack.push({
          type: TaskType.HandleAgentResponse,
          payload: agentResponse
        })
        return newTaskStack
      })
    }

    const handleTaskStack = async (): Promise<void> => {
      console.log('handleTaskStack')
      if (activeTask) {
        // Task already in progress
        console.log('task already in progress')
        return
      }
      if (taskStack.length === 0) {
        console.log('task stack empty')
        return
      }
      if (!isMounted) {
        console.log('handleTaskStack not mounted')
        return
      }
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      const nextTask = [...taskStack].pop() as MessageHandlerTask
      console.log('nextTask', nextTask)
      setActiveTask(nextTask)
      setTaskStack([...taskStack].slice(0, -1))
      switch (nextTask.type) {
        case TaskType.ReviewPendingMessage: {
          console.log('review pending message')
          await handleReviewPendingMessageTask(nextTask)
          break
        }
        case TaskType.HandleAgentResponse: {
          console.log('handle agent response')
          await handleAgentResponseTask(nextTask)
          break
        }
        case TaskType.CallTool: {
          console.log('call tool')
          await handleCallToolTask(nextTask)
          break
        }
        case TaskType.ReplyToToolCall: {
          console.log('reply to tool call')
          await handleReplyToToolCallTask()
          break
        }
        default: {
          throw new Error('Invalid task type')
        }
      }
      setActiveTask(undefined)
    }

    void handleTaskStack()

    return () => {
      isMounted = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskStack, activeTask])

  const sendMessage = async (message: string, context: Record<string, unknown>): Promise<void> => {
    console.log('sendMessage')
    console.log('updating message history')
    setMessageHistory([
      ...messageHistory,
      {
        content: message,
        role: 'user'
      }
    ])
    console.log('adding task to stack')
    setTaskStack((queue) => [
      ...queue,
      {
        type: TaskType.ReviewPendingMessage,
        payload: {
          message,
          context
        }
      }
    ])
  }

  const loading = useMemo(() => activeTask !== undefined, [activeTask])

  return {
    sendMessage,
    messageHistory,
    loading
  }
}

export default useSendMessage
