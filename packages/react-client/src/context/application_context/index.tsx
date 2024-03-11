import React from 'react'
import useSendMessage from './use_handle_message'
import { type AgentRequestHandler } from '@palico-ai/client-js'

export interface ChatMessage {
  content: string
  role: 'user' | 'assistant'
}

export interface PalicoContextProps {
  loading: boolean
  conversationHistory: ChatMessage[]
  sendMessage: (
    message: string,
    context: Record<string, unknown>
  ) => Promise<void>
}

export const PalicoContext = React.createContext<PalicoContextProps>({
  loading: false,
  conversationHistory: [],
  sendMessage: async () => {return}
})

export type ToolHandler<Input, Output> = (input: Input) => Promise<Output>

export interface PalicoContextProviderProps {
  requestHandler: AgentRequestHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools: Record<string, ToolHandler<any, any>>
  children?: React.ReactNode
}

export interface PendingMessagePayload {
  message: string
  context: Record<string, unknown>
}

export const PalicoContextProvider: React.FC<PalicoContextProviderProps> = ({
  requestHandler,
  tools,
  children
}) => {
  const {
    sendMessage: handleSendMessage,
    messageHistory,
    loading
  } = useSendMessage({
    requestHandler,
    tools
  })

  const sendMessage = async (
    message: string,
    context: Record<string, unknown>
  ): Promise<void> => {
    console.log('Calling sendMessage')
    await handleSendMessage(message, context)
    console.log('Done calling sendMessage')
  }

  return (
    <PalicoContext.Provider
      value={{
        conversationHistory: messageHistory,
        sendMessage,
        loading
      }}
    >
      {children}
    </PalicoContext.Provider>
  )
}
