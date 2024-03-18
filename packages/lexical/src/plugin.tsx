import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useCallback, useEffect, useState } from 'react';
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { mergeRegister } from '@lexical/utils';
import 'react-toastify/dist/ReactToastify.css';
import { LexicalAITypeahead } from './typeahead';
import { ToastContainer } from 'react-toastify';
import { LexicalAITypeaheadProvider } from './typeahead.context';
import { AIAction, LexicalAIPluginUserOverrideProps } from './types';
import { useParseContentNode } from './utils';

export const OPEN_ASK_AI_COMMAND = createCommand('palico-ai/open-ask-ai');
export const CLOSE_ASK_AI_COMMAND = createCommand('palico-ai/close-ask-ai');

export type ElementAbsoluteCoordinate = { x: number; y: number };

export interface LexicalAIPluginProps extends LexicalAIPluginUserOverrideProps {
  options: AIAction[];
}

export const LexicalAIPlugin: React.FC<LexicalAIPluginProps> = ({
  options,
  setParsers,
  customParsers,
  editorTheme,
  lexicalNodes,
  setInvalidTypeParser,
  renderCancelButton,
  renderInsertButton,
  renderReplaceButton,
}) => {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const contentNodeParser = useParseContentNode({
    setParsers,
    customParsers,
    setInvalidTypeParser,
  });
  const handleOpenAskAI = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        OPEN_ASK_AI_COMMAND,
        () => {
          console.log('Open Ask AI Command');
          handleOpenAskAI();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        CLOSE_ASK_AI_COMMAND,
        () => {
          handleClose();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, handleClose, handleOpenAskAI]);

  return (
    <LexicalAITypeaheadProvider
      actions={options}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <ToastContainer />
      <LexicalAITypeahead
        lexicalNodes={lexicalNodes}
        editorTheme={editorTheme}
        lexicalContentNodeParser={contentNodeParser}
        renderCancelButton={renderCancelButton}
        renderInsertButton={renderInsertButton}
        renderReplaceButton={renderReplaceButton}
      />
    </LexicalAITypeaheadProvider>
  );
};
