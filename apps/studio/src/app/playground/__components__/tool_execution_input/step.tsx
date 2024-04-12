'use client'

import { Editor } from "@monaco-editor/react";
import { Box, Button, StepContent, Typography } from "@mui/material";
import { ChatCompletionMessageToolCall } from "openai/resources/chat/completions";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import darkTheme from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';

type ToolStepProps = {
  toolCall: ChatCompletionMessageToolCall;
  outputValue?: string;
  setOutputValue: (value: string | undefined) => void;
  selectNextStep?: () => void;
  selectPrevStep?: () => void;
  selectSubmit?: () => Promise<void>;
};

const ToolStep: React.FC<ToolStepProps> = ({
  toolCall,
  selectNextStep,
  outputValue,
  setOutputValue,
  selectPrevStep,
  selectSubmit,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>();

  const validateOutput = (): boolean => {
    setErrorMessage(undefined);
    if (!outputValue) {
      return true;
    }
    try {
      JSON.parse(outputValue);
      return true;
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message ?? 'Invalid JSON');
      }
      throw false;
    }
  };

  const handleClickBack = () => {
    if (validateOutput()) {
      selectPrevStep && selectPrevStep();
    }
  }

  const handleClickNext = () => {
    if (validateOutput()) {
      selectNextStep && selectNextStep();
    }
  }

  const handleClickSubmit = async () => {
    if (validateOutput()) {
      try {
        selectSubmit && await selectSubmit();
      } catch (e) {
        if (e instanceof Error) {
          setErrorMessage(e.message ?? 'Invalid JSON');
        } else {
          setErrorMessage('Something went wrong');
        }
      }
    }
  }

  return (
    <StepContent>
      <Typography variant="subtitle2" fontWeight={'bold'}>
        Function Input
      </Typography>
      <SyntaxHighlighter language="javascript" style={darkTheme}>
        {toolCall.function.arguments}
      </SyntaxHighlighter>
      <Typography variant="subtitle2" fontWeight={'bold'}>
        Function Result
      </Typography>
      <Editor
        theme="vs-dark"
        height="200px"
        language="json"
        value={outputValue}
        onChange={setOutputValue}
        options={{
          scrollBeyondLastColumn: 0,
        }}
      />
      {errorMessage && (
        <Typography variant="body1" color={'error'}>
          {errorMessage}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
        {selectPrevStep && (
          <Button
            color="secondary"
            variant="contained"
            onClick={handleClickBack}
          >
            Previous
          </Button>
        )}
        {selectNextStep && (
          <Button
            color="info"
            variant="contained"
            onClick={handleClickNext}
          >
            Next
          </Button>
        )}
        {selectSubmit && (
          <Button
            color="primary"
            variant="contained"
            onClick={handleClickSubmit}
          >
            Submit
          </Button>
        )}
      </Box>
    </StepContent>
  );
};

export default ToolStep;