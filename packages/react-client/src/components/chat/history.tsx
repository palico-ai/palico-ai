import React, { useEffect } from 'react'
import { type ChatMessage } from '../../context'
import { Box, Typography } from '@mui/material'

export interface ChatHistoryProps {
  initialMessage?: string
  history: ChatMessage[]
}

interface ChatListItemProps extends ChatMessage {
  ref?: React.Ref<unknown> | undefined
}

const ChatListItem: React.FC<ChatListItemProps> = ({ role, content, ref }) => {
  return (
    <Box
      ref={ref}
      sx={{
        borderRadius: 2,
        mb: 1,
        px: 2,
        py: 1,
        backgroundColor: role === 'user' ? '#e0e0e0' : '#f5f5f5'
      }}
    >
      <Typography
        variant="body1"
        textAlign={role === 'user' ? 'right' : 'left'}
      >
        {content}
      </Typography>
    </Box>
  )
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  history,
  initialMessage
}) => {
  const [lastMessageEl, setLastMessageEl] =
    React.useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (lastMessageEl) {
      lastMessageEl.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    }
  }, [lastMessageEl])

  return (
    <Box>
      {initialMessage && (
        <ChatListItem
          // eslint-disable-next-line jsx-a11y/aria-role
          role="assistant"
          content={initialMessage}
          ref={setLastMessageEl}
        />
      )}
      {history.map((conversation, index) => {
        const isLastMessage = index === history.length - 1
        return (
          <ChatListItem
            key={index}
            role={conversation.role}
            content={conversation.content ?? 'Invalid message'}
            ref={isLastMessage ? setLastMessageEl : undefined}
          />
        )
      })}
    </Box>
  )
}