import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '../dialog/dialog';
import { FormBuilder, FormBuilderProps } from './form_builder';
import { DialogProps } from '@mui/material';

export type SimpleDialogFormOnSubmitHandler = (
  data: Record<string, string>
) => Promise<void>;

interface SimpleDialogFormProps extends FormBuilderProps {
  title: string;
  isOpen: boolean;
  closeForm: () => void;
  maxWidth?: DialogProps['maxWidth'];
}

export const SimpleDialogForm: React.FC<SimpleDialogFormProps> = ({
  title,
  isOpen,
  closeForm,
  onSubmit,
  maxWidth,
  ...formBuilderProps
}) => {
  const handleFormSubmit = async (
    data: Record<string, string>
  ): Promise<void> => {
    await onSubmit(data);
    closeForm();
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={maxWidth}
      open={isOpen}
      onClose={closeForm}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <FormBuilder onSubmit={handleFormSubmit} {...formBuilderProps} />
      </DialogContent>
    </Dialog>
  );
};
