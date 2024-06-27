'use client';

import { Editor } from '@palico-ai/components';
import React from 'react';

export interface CodeSnippetTabFragmentProps {
  codeSnippet: string;
  height: string | number;
}

export const CodeSnippetTabFragment: React.FC<CodeSnippetTabFragmentProps> = ({
  height,
  codeSnippet,
}) => {
  return (
    <Editor
      options={{
        readOnly: true,
        minimap: {
          enabled: false,
        },
      }}
      defaultLanguage="typescript"
      onMount={(_, monoco) => {
        monoco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true,
          noSuggestionDiagnostics: true,
        });
      }}
      height={height}
      language="typescript"
      value={codeSnippet}
    />
  );
};
