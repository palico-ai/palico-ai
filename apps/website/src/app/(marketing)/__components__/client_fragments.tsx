'use client';

import { Editor, LinkButton } from '@palico-ai/components';
import React from 'react';
import { styled } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
  textDecorationColor: theme.palette.info.light,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    // cursor: "",
  },
}));

interface LearnMoreButtonProps {
  href: string;
  label?: string;
}

export const LearnMoreButton: React.FC<LearnMoreButtonProps> = ({
  href,
  label = 'Learn More',
}) => {
  return (
    <LinkButton
      endIcon={<OpenInNewIcon />}
      href={href}
      openInNewTab
      color="secondary"
      size="small"
      variant="outlined"
    >
      {label}
    </LinkButton>
  );
};
