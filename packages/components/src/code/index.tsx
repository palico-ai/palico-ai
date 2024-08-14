'use client';
import { Editor as MonacoEditor, EditorProps } from '@monaco-editor/react';
import React from 'react';
import Highlight, { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import darkTheme from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = (props) => {
  return <Highlight {...props} style={darkTheme} />;
};

export const Editor: React.FC<EditorProps> = ({
  options: { scrollbar, ...restOptions } = {},
  ...rest
}) => {
  return (
    <MonacoEditor
      options={{
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
        },
        scrollBeyondLastLine: false,
        ...restOptions,
      }}
      {...rest}
      // theme="vs-dark"
    />
  );
};
