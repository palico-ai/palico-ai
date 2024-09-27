'use client';

import {
  Box,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { ChatCompletionMessageToolCall } from 'openai/resources/chat/completions';
import React from 'react';
import ToolStep from './step';
import { ReplyToToolCallParams } from '@palico-ai/client-js';

export type ToolExecutionInputProps = {
  toolCalls: ChatCompletionMessageToolCall[];
  handleSubmit: (output: ReplyToToolCallParams["toolOutputs"]) => Promise<void>;
};

const ToolExecutionInput: React.FC<ToolExecutionInputProps> = ({
  toolCalls,
  handleSubmit: onSubmit
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [toolIdOutputValue, setToolOutputValue] = React.useState<
    Record<string, string | undefined>
  >({});

  const setToolIDOutputValue = (toolId: string, value: string | undefined) => {
    setToolOutputValue({
      ...toolIdOutputValue,
      [toolId]: value,
    });
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    console.log('Pressed submit');
    const output: ReplyToToolCallParams["toolOutputs"] = toolCalls.map((tool) => ({
      toolId: tool.id,
      functionName: tool.function.name,
      output: toolIdOutputValue[tool.id] ?? {},
    }));
    await onSubmit(output);
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {toolCalls.map((toolCall, index) => {
          const {
            function: { arguments: args },
          } = toolCall;
          const maxArgsLength = 35;
          return (
            <Step key={index}>
              <StepLabel>
                <code>
                  {toolCall.function.name}(
                  {`${args.substring(0, maxArgsLength)}${
                    args.length > maxArgsLength ? '...' : ''
                  }`}
                  )
                </code>
              </StepLabel>
              <ToolStep
                key={index}
                toolCall={toolCall}
                outputValue={toolIdOutputValue[toolCall.id]}
                setOutputValue={(value) =>
                  setToolIDOutputValue(toolCall.id, value)
                }
                selectNextStep={
                  index < toolCalls.length - 1 ? handleNext : undefined
                }
                selectPrevStep={index > 0 ? handleBack : undefined}
                selectSubmit={
                  index === toolCalls.length - 1 ? handleSubmit : undefined
                }
              />
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default ToolExecutionInput;
