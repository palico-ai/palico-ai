'use client';
import {
  Editor as MonacoEditor,
  EditorProps as MEditorProps,
} from '@monaco-editor/react';
import React from 'react';
import Highlight, { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import darkTheme from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = (props) => {
  return <Highlight {...props} style={darkTheme} />;
};

export interface EditorProps extends MEditorProps {
  autoReizeMinHeight?: number;
  autoReizeMaxHeight?: number;
}

export const Editor: React.FC<EditorProps> = ({
  autoReizeMinHeight = 0,
  height: propHeight,
  autoReizeMaxHeight,
  onMount,
  options: { scrollbar, ...restOptions } = {},
  ...rest
}) => {
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  return (
    <MonacoEditor
      height={height ?? propHeight}
      options={{
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
        },
        scrollBeyondLastLine: false,
        ...restOptions,
      }}
      onMount={(editor, monoco) => {
        if (autoReizeMaxHeight) {
          editor.onDidContentSizeChange((e) => {
            const contentHeight = e.contentHeight;
            if (contentHeight > autoReizeMaxHeight) {
              setHeight(autoReizeMaxHeight);
            } else if (contentHeight < autoReizeMinHeight) {
              setHeight(autoReizeMinHeight);
            } else {
              setHeight(contentHeight);
            }
          });
        }
        if (onMount) {
          onMount(editor, monoco);
        }
      }}
      {...rest}
      theme="vs-dark"
    />
  );
};
