import React from 'react'
import { Dialog as MUIDialog, DialogActions, DialogContent, DialogContentText, DialogTitle, DialogProps } from '@mui/material'

export {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  ...rest
}) => {
  return (
    <MUIDialog {...rest}>
      {children}
    </MUIDialog>
  )
}
