import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from './dialog';
import { Button } from '../button';

export interface PromptAcceptActionProps {
  isOpen: boolean;
  title: string;
  message: string;
  onAccept: () => Promise<void>;
  closePrompt: () => void;
}

export const PromptAcceptAction: React.FC<PromptAcceptActionProps> = ({
  isOpen,
  title,
  message,
  onAccept,
  closePrompt,
}) => {
  const handleAccept = async () => {
    await onAccept();
    closePrompt();
  };

  return (
    <Dialog open={isOpen} onClose={closePrompt}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={closePrompt}>
          Cancel
        </Button>
        <Button variant="contained" color="warning" onClick={handleAccept}>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};
