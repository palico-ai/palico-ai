import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import React from 'react'
import { ContentNode, UseParseContentNodeParams, useParseContentNode } from '../../utils/use_content_node_parser';

export interface LexicalPreviewContentProps extends UseParseContentNodeParams  {
  content: ContentNode[];
}

const LexicalPreviewContent : React.FC<LexicalPreviewContentProps> = ({
  content,
  parsers,
  parseInvalidType,
}) => {
  const [editor] = useLexicalComposerContext();
  const parseContentNode = useParseContentNode({
    parsers,
    parseInvalidType,
  })

  React.useEffect(() => {
    const updatePreview = async () => {
      editor.update(() => {
        const nodes = parseContentNode(content);
        const root = $getRoot();
        root.clear()
        root.append(...nodes);
      });
    }
    void updatePreview();
  }, [content, editor, parseContentNode]);

  return null;
}

export default LexicalPreviewContent