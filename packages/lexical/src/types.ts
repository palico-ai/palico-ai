import { EditorThemeClasses } from 'lexical';
import { ContentNodeParserFN } from './utils';
import { InitialConfigType } from '@lexical/react/LexicalComposer';
import { ConversationContextParams } from '@palico-ai/client-js';

export interface AIActionOption {
  label: string;
  value: string;
}

export interface FormatAPIRequestParams {
  selectedOptionValue?: string; // Only present if the action requires a selection
  selectedText?: string; // If user has selected a range of text
  freeText?: string; // Only present if the action requires free text
}

export interface DefaultRichTextEditorContext<
  Payload = FormatAPIRequestParams
> extends ConversationContextParams {
  action: string;
  payload: Payload;
}

export interface AskAgentRequestParams<
  PromptContext extends ConversationContextParams = DefaultRichTextEditorContext
> {
  agentId: string
  message: string;
  context: PromptContext;
}

export type FormatAPIRequestFN<PromptContext extends ConversationContextParams = DefaultRichTextEditorContext> = (
  input: FormatAPIRequestParams
) => Promise<AskAgentRequestParams<PromptContext>>;

// TODO: Provide an override on select
export interface AIAction {
  name: string;
  label?: string;
  requiresRangeSelection?: boolean; // default: false
  promptForFreeText?: boolean; // default: false
  options?: AIActionOption[];
  formatAPIRequest?: FormatAPIRequestFN;
}

type ButtonOverrideFNParams = {
  isLoading: boolean;
};

type ButtonOverrideFN = (
  onClick: () => void,
  params: ButtonOverrideFNParams
) => React.ReactNode;

export interface PreviewUIOverrideProps {
  editorTheme?: EditorThemeClasses;
  renderInsertButton?: ButtonOverrideFN;
  renderReplaceButton?: ButtonOverrideFN;
  renderCancelButton?: ButtonOverrideFN;
}

export type LexicalAIUIOverrideProps = PreviewUIOverrideProps;

export type PreviewLexicalEditorOverrides = {
  editorTheme?: EditorThemeClasses;
  lexicalNodes?: InitialConfigType["nodes"];
  additionalLexicalNodesNodes?: InitialConfigType["nodes"];
}

export interface ParserOverrideProps {
  additionalContentParsers?: Record<string, ContentNodeParserFN>;
  contentParsers?: Record<string, ContentNodeParserFN>; // Default: Paragraph and Header (1, 2, 3)
  setInvalidTypeParser?: ContentNodeParserFN;
}

export interface LexicalAIPluginUserOverrideProps
  extends LexicalAIUIOverrideProps,
    ParserOverrideProps, 
    PreviewLexicalEditorOverrides
     {}
