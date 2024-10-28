import React from 'react';
import MarkdownJSX, { MarkdownToJSX } from 'markdown-to-jsx';
import { TypographyProps, Typography } from './typography';
import { SyntaxHighlighter } from '../code';
import { THEME_COLOR } from '../theme/colors';

export interface MarkdownProps {
  children: string;
  overrides?: MarkdownToJSX.Overrides;
}

const override = (
  variant: TypographyProps['variant'],
  props: Omit<TypographyProps, 'children'> = {}
) => {
  return {
    component: Typography,
    props: {
      variant,
      gutterBottom: true,
      ...props,
    },
  };
};

const RenderCode = ({ children }: { children: string }) => {
  const isMultiLine = children.split('\n').length > 1;
  if (isMultiLine) {
    return <SyntaxHighlighter>{children}</SyntaxHighlighter>;
  }
  return (
    <code
      style={{
        backgroundColor: THEME_COLOR.secondary,
        padding: '2px 4px',
        borderRadius: 4,
      }}
    >
      {children}
    </code>
  );
};

export const Markdown: React.FC<MarkdownProps> = ({
  children,
  overrides = {},
}) => {
  return (
    <MarkdownJSX
      options={{
        overrides: {
          h1: override('h1'),
          h2: override('h2'),
          h3: override('h3'),
          h4: override('h4'),
          h5: override('h5'),
          h6: override('h6'),
          p: override('body1', { fontSize: 16 }),
          span: override('body1', { fontSize: 16 }),
          li: override('body1'),
          ul: override('body1'),
          code: {
            component: RenderCode,
          },
          ...overrides,
        },
      }}
    >
      {children}
    </MarkdownJSX>
  );
};
