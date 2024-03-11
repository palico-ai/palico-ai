import { Box, Divider, Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { ChatHeader } from './header'
import { PalicoContext } from '../../context'
import { ChatHistory } from './history'
import { ChatInput } from './input'

export type GetSendMessageParamsFN = (userInput: string) => Promise<{
  message: string
  context: Record<string, unknown>
}>

export interface ChatUIProps {
  headerTitle?: string
  inputPlaceholder?: string
  initialPlaceholderAgentMessage?: string
  getSendMessageParams?: GetSendMessageParamsFN
}

const DEFAULT_VALUES = {
  headerTitle: 'Copilot',
  inputPlaceholder: 'Type a message',
  initialPlaceholderAgentMessage: 'Hello! How can I help you today?'
}

const ChatUI: React.FC<ChatUIProps> = ({
  headerTitle = DEFAULT_VALUES.headerTitle,
  inputPlaceholder = DEFAULT_VALUES.inputPlaceholder,
  initialPlaceholderAgentMessage = DEFAULT_VALUES.initialPlaceholderAgentMessage,
  getSendMessageParams
}) => {
  const { conversationHistory, loading, sendMessage } = useContext(PalicoContext)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSend = async (message: string): Promise<void> => {
    if (!sendMessage) throw new Error('sendMessage is not defined')
    try {
      if (getSendMessageParams) {
        const { message: newMessage, context } = await getSendMessageParams(
          message
        )
        await sendMessage(newMessage, context)
      } else {
        await sendMessage(message, {})
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('An unknown error occurred')
      }
    }
  }

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
      sx={{
        width: '100%',
        height: '100%',
        padding: 2,
        boxSizing: 'border-box'
      }}
    >
      <Box>
        <ChatHeader title={headerTitle ?? DEFAULT_VALUES.headerTitle} />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto'
        }}
      >
        <ChatHistory
          initialMessage={initialPlaceholderAgentMessage}
          history={conversationHistory}
        />
      </Box>
      {errorMessage && (
        <Typography variant="caption" color={'error'}>
          {errorMessage}
        </Typography>
      )}
      <Divider />
      <Box>
        <ChatInput
          placeholder={inputPlaceholder}
          disabled={errorMessage !== null || loading}
          onSend={handleSend}
        />
      </Box>
    </Stack>
  )
}

export default ChatUI
