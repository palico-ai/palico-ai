import { PropsOf } from '@emotion/react';
import React from 'react';
import { Typography } from '../typography';
import { ExtFile } from '@dropzone-ui/react';
import { FileUpload } from './file_upload';
import { Box } from '@mui/material';
import { Button } from '../button';
import { TextField } from './textfield';
import { Editor } from '@monaco-editor/react';

export enum AcceptFileTypes {
  Image = 'image/*',
  Video = 'video/*',
  Audio = 'audio/*',
  Text = 'text/*',
  Application = 'application/*',
  Pdf = '.pdf',
  Doc = '.doc',
  Docx = '.docx',
}

const DEFAULT_EDITOR_HEIGHT = '200px';
const DEFAULT_EDITOR_LANGUAGE = 'json';

export type FormFieldType = PropsOf<typeof TextField>['type'] & 'code';

export interface FormField {
  name: string;
  label: string;
  required?: boolean;
  initialValue?: string; // Initial value for the field -- useful for non-controlled components
  controlledTextInput?: {
    value?: string;
    onChange: (value?: string) => void;
  };
  type?: PropsOf<typeof TextField>['type'];
  autoComplete?: boolean;
  helperText?: string;
  multiline?: {
    rows?: number;
    rowsMax?: number;
  };
  editor?: {
    language?: string;
    height?: string;
  };
  selectOptions?: PropsOf<typeof TextField>['selectOptions'];
  acceptedFileTypes?: string[];
  maxFiles?: number;
}

export type FormBuilderOnSubmit = (
  data: Record<string, string>
) => Promise<void>;

export interface FormBuilderProps {
  formFields: FormField[];
  onSubmit: FormBuilderOnSubmit;
  submitButtonText?: string;
  submitButtonColor?: PropsOf<typeof Button>['color'];
  submitButtonVariant?: PropsOf<typeof Button>['variant'];
  submitButtonFullWidth?: boolean;
  submitButtonAlign?: 'left' | 'center' | 'right';
  presistFormValueOnSubmit?: boolean;
}

const resetFormInputs = (formFields: FormField[]): Record<string, string> => {
  return formFields.reduce((acc, field) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = '';
    if (field.initialValue) {
      value = field.initialValue;
    } else if (field.type === 'select' && field.selectOptions) {
      value = field.selectOptions[0]?.value ?? '';
    } else if (field.type === 'file') {
      value = [];
    } else if (field.type === 'code') {
      value = field.initialValue ?? '';
    }
    return {
      ...acc,
      [field.name]: value,
    };
  }, {});
};

export const FormBuilder: React.FC<FormBuilderProps> = ({
  formFields,
  onSubmit,
  submitButtonText = 'Submit',
  submitButtonColor = 'primary',
  submitButtonVariant = 'contained',
  submitButtonAlign = 'right',
  presistFormValueOnSubmit = false,
  submitButtonFullWidth = false,
}) => {
  const [formInputs, setFormInputs] = React.useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>
  >(resetFormInputs(formFields));
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormInputs({
      ...formInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      setErrorMessage('');
      setLoading(true);
      formFields.forEach((field) => {
        if (!field.required) return;
        if (!formInputs[field.name] || formInputs[field.name] === '') {
          throw new Error(`${field.label} is required`);
        }
        if (field.type === 'file' && formInputs[field.name].length === 0) {
          throw new Error(`${field.label} is required`);
        }
      });
      await onSubmit(formInputs);
      if (!presistFormValueOnSubmit) {
        setFormInputs(resetFormInputs(formFields));
      }
      resetFormInputs(formFields);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFile = (name: string, newFiles: ExtFile[]): void => {
    setFormInputs({
      ...formInputs,
      [name]: newFiles,
    });
  };

  const renderTextField = (field: FormField, index: number): JSX.Element => {
    const { controlledTextInput } = field;
    return (
      <TextField
        key={index}
        autoFocus={index === 0}
        inputProps={{
          autoFocus: index === 0,
        }}
        margin="dense"
        name={field.name}
        label={field.label}
        helperText={field.helperText}
        autoComplete={field.autoComplete ? 'on' : 'off'}
        type={field.type ?? 'text'}
        select={field.type === 'select' ? true : undefined}
        fullWidth
        required={field.required}
        multiline={field.multiline !== undefined}
        rows={field.multiline?.rows}
        maxRows={field.multiline?.rowsMax}
        value={
          controlledTextInput
            ? controlledTextInput.value
            : formInputs[field.name]
        }
        onChange={(e) => {
          handleInputChange(e);
          controlledTextInput?.onChange(e.target.value);
        }}
        selectOptions={field.selectOptions}
        gutterBottom
      />
    );
  };

  const renderFileField = (field: FormField, index: number): JSX.Element => {
    return (
      <FileUpload
        maxFiles={field.maxFiles ?? 1}
        accept={field.acceptedFileTypes?.join(',') ?? '*'}
        key={index}
        name={field.name}
        label={field.label}
        value={formInputs[field.name]}
        onChange={(newFiles) => {
          handleSubmitFile(field.name, newFiles);
        }}
      />
    );
  };

  const renderCodeField = (field: FormField, index: number): JSX.Element => {
    return (
      <Box mt={1} key={index}>
        <Typography variant="body2" fontWeight={400} gutterBottom>
          {field.label}
        </Typography>
        <Editor
          theme="vs-dark"
          value={field.controlledTextInput?.value ?? formInputs[field.name]}
          onChange={(value) => {
            setFormInputs({
              ...formInputs,
              [field.name]: value,
            });
            field.controlledTextInput?.onChange(value);
          }}
          height={field.editor?.height ?? DEFAULT_EDITOR_HEIGHT}
          language={field.editor?.language ?? DEFAULT_EDITOR_LANGUAGE}
          options={{
            ariaLabel: 'User Message',
            scrollBeyondLastColumn: 0,
          }}
        />
      </Box>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((field, index) => {
        switch (field.type) {
          case 'file':
            return renderFileField(field, index);
          case 'code':
            return renderCodeField(field, index);
          default:
            return renderTextField(field, index);
        }
      })}
      {errorMessage && (
        <Typography color="error" gutterBottom>
          {errorMessage}
        </Typography>
      )}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: submitButtonAlign,
        }}
      >
        <Button
          fullWidth={submitButtonFullWidth}
          type="submit"
          variant={submitButtonVariant}
          color={submitButtonColor}
          loading={loading}
        >
          {submitButtonText}
        </Button>
      </Box>
    </form>
  );
};
