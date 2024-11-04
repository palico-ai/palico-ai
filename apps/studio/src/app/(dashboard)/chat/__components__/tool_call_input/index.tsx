import { ToolCall, useChat } from '@palico-ai/react';
import React from 'react';

export interface ToolCallInputProps {
  pendingToolCalls: ToolCall[];
  addResult: ReturnType<typeof useChat>['addResult'];
}

const ToolCallInput: React.FC<ToolCallInputProps> = ({
  pendingToolCalls,
  addResult,
}) => {
  return (
    <div>
      {pendingToolCalls.map((toolCall, index) => (
        <div key={index}>
          <div>{toolCall.name}</div>
          <button onClick={() => addResult(toolCall, { result: 'result' })}>
            Add Result
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToolCallInput;
