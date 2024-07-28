import React from 'react';
import {
  Dialog as MUIDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
} from '@mui/material';

export { DialogActions, DialogContent, DialogContentText, DialogTitle };

export const Dialog: React.FC<DialogProps> = ({ children, sx, ...rest }) => {
  return <MUIDialog
   sx={{
    "& .MuiDialog-paper": {
      backgroundColor: '#000000',
    },
    ...sx,
   }}
  {...rest}>{children}</MUIDialog>;
};
