'use client';

import { Editor } from '@palico-ai/components';
import React from 'react';
import { styled } from '@mui/material';

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
        fontSize: 16,
        wordWrap: 'on',
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

export const HighlightSpan = styled('span')(({ theme }) => ({
  textDecoration: 'underline',
  textUnderlineOffset: '5px',
  textDecorationThickness: '2px',
  textDecorationColor: theme.palette.primary.main,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
  },
}));
