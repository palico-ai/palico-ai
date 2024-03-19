import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $insertNodes } from 'lexical';
import React from 'react'
import { ContentNode, LexicalContentNodeParser } from '../../utils/use_content_node_parser';

export interface LexicalPreviewContentProps  {
  content: ContentNode[];
  lexicalContentNodeParser: LexicalContentNodeParser
}

const LexicalPreviewContent : React.FC<LexicalPreviewContentProps> = ({
  content,
  lexicalContentNodeParser
}) => {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => {
    const updatePreview = async () => {
      editor.update(() => {
        const nodes = lexicalContentNodeParser(content);
        const root = $getRoot();
        root.clear()
        $insertNodes(nodes);
      });
    }
    void updatePreview();
  }, [content, editor, lexicalContentNodeParser]);

  return null;
}

export default LexicalPreviewContent