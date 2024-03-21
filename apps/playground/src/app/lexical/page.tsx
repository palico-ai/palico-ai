'use client';

import ExampleTheme from './themes/ExampleTheme';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { $createListNode, $createListItemNode } from '@lexical/list';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import './styles.css';
import { LexicalAIPlugin, ContentNodeParserFN } from '@palico-ai/lexical';
import { Container } from '@mui/material';
import HotKeyPlugin from './plugins/hotkey_plugin';
import { $createTextNode } from 'lexical';
import { createRequestHandler } from '@palico-ai/client-js';
import { aiActions } from './constants';

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
  namespace: '',
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

interface ListContentNode {
  type: 'bullet_list';
  value: string[];
}

const agentAPIURL =
  process.env.NEXT_PUBLIC_LEXICAL_AI_URL ?? 'http://localhost:8000';
const serviceKey =
  process.env.NEXT_PUBLIC_LEXICAL_AI_SERVICE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50SWQiOi0xLCJpYXQiOjE3MDk0MDIzMTJ9.2ttpybL5p9aQHzk-utoFgitA7AGF6yBA8-M95WSbpfc';

const agentRequestHandler = createRequestHandler(agentAPIURL, serviceKey);

export default function Editor() {
  const parseBulletListNode: ContentNodeParserFN = (entry) => {
    const list = $createListNode('bullet');
    const contentNode = entry as ListContentNode;
    contentNode.value.forEach((item) => {
      const listItem = $createListItemNode();
      listItem.append($createTextNode(item));
      list.append(listItem);
    });
    return [list];
  };

  return (
    <Container>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <LexicalAIPlugin
              requestHandler={agentRequestHandler}
              actions={aiActions}
              editorTheme={ExampleTheme}
              additionalContentParsers={{
                bullet_list: parseBulletListNode,
              }}
              additionalLexicalNodesNodes={[ListNode, ListItemNode]}
            />
            <HotKeyPlugin />
            <HistoryPlugin />
            {/* <TreeViewPlugin /> */}
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
      </LexicalComposer>
    </Container>
  );
}
