import React from 'react'
import { Box, Popover } from '@mui/material'
import ChatUI, { type ChatUIProps } from '../chat'
import { type PropsOf } from '@emotion/react'

export interface ChatWidgetProps extends ChatUIProps {
  anchorEl: PropsOf<typeof Popover>['anchorEl']
  open: boolean
  onClose: () => void
  anchorOrigin?: PropsOf<typeof Popover>['anchorOrigin']
  transformOrigin?: PropsOf<typeof Popover>['transformOrigin']
  width?: string
  height?: string
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  anchorEl,
  open,
  onClose: handleClose,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'left'
  },
  transformOrigin = {
    vertical: 'bottom',
    horizontal: 'left'
  },
  width = '400px',
  height = '500px',
  ...chatUIProps
}) => {
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <Box sx={{ width, height }}>
        <ChatUI {...chatUIProps} />
      </Box>
    </Popover>
  )
}
