import React from 'react'
import { Box, Divider, Typography } from '@mui/material'

export interface ChatHeaderProps {
  title: string
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Divider />
    </Box>
  )
}
