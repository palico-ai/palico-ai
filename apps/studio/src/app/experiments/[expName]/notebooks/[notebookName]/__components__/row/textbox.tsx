import { TextField } from '@palico-ai/components';
import React from 'react';
import { useHandleChangeTextWidget } from '../notebook.context';

interface TextboxNotebookWidgetProps {
  index: number;
}

const TextboxNotebookWidget: React.FC<TextboxNotebookWidgetProps> = ({
  index,
}) => {
  const { value, onChange } = useHandleChangeTextWidget(index);

  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      multiline
      fullWidth
      variant="outlined"
      placeholder="Type here..."
    />
  );
};

export default TextboxNotebookWidget;
