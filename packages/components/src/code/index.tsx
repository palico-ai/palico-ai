import React from 'react';
import Highlight, { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import darkTheme from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = (props) => {
  return <Highlight {...props} style={darkTheme} />;
};
