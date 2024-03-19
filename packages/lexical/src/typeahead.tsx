import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useCallback, useContext, useMemo } from 'react';
import PromptFreetext from './steps/prompt_freetext';
import { getRequestParamForAction } from './utils/request';
import RenderPreview from './steps/preview';
import { LexicalContentNodeParser } from './utils/use_content_node_parser';
import { LexicalAITypeaheadContext, Step } from './typeahead.context';
import PromptSelectAIAction, { OnSelectParams } from './steps/select_action';
import {
  AIAction,
  AskAgentRequestParams,
  PreviewLexicalEditorOverrides,
  PreviewUIOverrideProps,
} from './types';
import { useShowError } from './utils/useShowError';
import ThemeProvider from './theme';
import { AgentRequestHandler, AgentRequestType } from '@palico-ai/client-js';
import { useInsertContentNode } from './utils/use_insert_content_node';

export interface LexicalAITypeaheadProps
  extends PreviewUIOverrideProps,
    PreviewLexicalEditorOverrides {
  lexicalContentNodeParser: LexicalContentNodeParser;
  requestHandler: AgentRequestHandler;
}

export const LexicalAITypeahead: React.FC<LexicalAITypeaheadProps> = ({
  renderCancelButton,
  additionalLexicalNodesNodes,
  renderInsertButton,
  renderReplaceButton,
  requestHandler,
  lexicalContentNodeParser: parseContentNode,
  editorTheme,
  lexicalNodes,
}) => {
  const {
    isOpen,
    actions: options,
    selection,
    handleClose,
    setStepValue: setStepOutput,
    stepValue: stepOutput,
    setActiveStep: setStep,
    activeStep: step,
  } = useContext(LexicalAITypeaheadContext);
  const [editor] = useLexicalComposerContext();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { showErrorMessage } = useShowError({ closeOnError: true });
  const { insertContentBelowSelection, replaceSelectionWithContent } =
    useInsertContentNode({
      editor,
      parser: parseContentNode,
    });

  const callAgentAndShowPreview = useCallback(
    async (params: AskAgentRequestParams) => {
      const response = await requestHandler({
        type: AgentRequestType.NewConversation,
        payload: {
          message: params.message,
          context: params.context,
        },
      });
      const content = response?.message.content;
      if (!content) {
        throw new Error('Invalid response from agent');
      }
      try {
        const contentNodes = JSON.parse(content as string);
        setStepOutput({
          ...stepOutput,
          [Step.PreviewGeneration]: contentNodes
        });
        setStep(Step.PreviewGeneration);
      } catch (error) {
        console.error(error);
        console.error('Error parsing content. Make sure agent is responding with valid JSON Array');
        console.log('received content')
        console.log(content)
        showErrorMessage('Error generating preview');
      }
    },
    [requestHandler, setStep, setStepOutput, showErrorMessage, stepOutput]
  );

  const handleSelectOption = useCallback(
    async (action: AIAction, params: OnSelectParams) => {
      if (action.promptForFreeText) {
        setStepOutput({
          ...stepOutput,
          [Step.SelectMenuItem]: {
            action,
            optionValue: params.selectedOptionValue,
          },
        });
        setStep(Step.AddFreeText);
        return;
      } else {
        const requestBody = await getRequestParamForAction({
          action,
          selectedOptionValue: params.selectedOptionValue,
          selectedText: selection?.rangeSelection?.selectedText,
        });
        await callAgentAndShowPreview(requestBody);
      }
    },
    [
      callAgentAndShowPreview,
      selection?.rangeSelection?.selectedText,
      setStep,
      setStepOutput,
      stepOutput,
    ]
  );

  const handleSubmitFreetext = useCallback(
    async (text: string) => {
      if (!stepOutput[Step.SelectMenuItem]) {
        showErrorMessage('No selected option', {
          consoleMessage:
            'No selected option. This is likely due to a bug transitioning from the select action step to the free text step.',
        });
        handleClose();
        return;
      }
      const selectedOption = stepOutput[Step.SelectMenuItem];
      try {
        const params = await getRequestParamForAction({
          action: selectedOption.action,
          selectedOptionValue: selectedOption.optionValue,
          freeText: text,
          selectedText: selection?.rangeSelection?.selectedText,
        });
        await callAgentAndShowPreview(params);
      } catch (error) {
        let message = 'An error occurred while querying the agent';
        if (error instanceof Error && error.message) {
          message = error.message;
        }
        showErrorMessage(message);
      }
    },
    [callAgentAndShowPreview, handleClose, selection?.rangeSelection?.selectedText, showErrorMessage, stepOutput]
  );

  const handleInsertBelowSelection = useCallback(async () => {
    if (!stepOutput[Step.PreviewGeneration]) {
      showErrorMessage('No preview content to insert', {
        consoleMessage:
          'No preview content to insert. This is likely due to a bug transitioning from the preview generation step to the insert below selection step.',
      });
      return;
    }
    insertContentBelowSelection(stepOutput[Step.PreviewGeneration]);
    handleClose({ dontRestoreSelection: true });
  }, [handleClose, insertContentBelowSelection, showErrorMessage, stepOutput]);

  const handleReplaceSelection = useCallback(async () => {
    if (!stepOutput[Step.PreviewGeneration]) {
      showErrorMessage('No preview content to insert', {
        consoleMessage:
          'No preview content to insert. This is likely due to a bug transitioning from the preview generation step to the insert below selection step.',
      });
      return;
    }
    replaceSelectionWithContent(stepOutput[Step.PreviewGeneration]);
    handleClose({ dontRestoreSelection: true });
  }, [handleClose, replaceSelectionWithContent, showErrorMessage, stepOutput]);

  const stepContent = useMemo(() => {
    if (!isOpen) return null;
    switch (step) {
      case Step.SelectMenuItem:
        return (
          <PromptSelectAIAction
            isRangeSelection={!!selection?.rangeSelection}
            cursorPosition={selection?.cursorPosition}
            actions={options}
            onSelectAction={handleSelectOption}
          />
        );
      case Step.AddFreeText:
        return (
          <PromptFreetext
            onSubmit={handleSubmitFreetext}
            cursorY={selection?.cursorPosition?.y}
          />
        );
      case Step.PreviewGeneration:
        return (
          <RenderPreview
            enableReplace={!!selection?.rangeSelection}
            lexicalContentNodeParser={parseContentNode}
            renderCancelButton={renderCancelButton}
            renderInsertButton={renderInsertButton}
            editorTheme={editorTheme}
            additionalLexicalNodesNodes={additionalLexicalNodesNodes}
            lexicalNodes={lexicalNodes}
            renderReplaceButton={renderReplaceButton}
            onSelectReplace={handleReplaceSelection}
            onSelectCancel={async () => {
              handleClose();
            }}
            onSelectInsertBelow={handleInsertBelowSelection}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            content={stepOutput[Step.PreviewGeneration]!}
          />
        );
      default:
        return null;
    }
  }, [
    additionalLexicalNodesNodes,
    editorTheme,
    handleClose,
    handleInsertBelowSelection,
    handleReplaceSelection,
    handleSelectOption,
    handleSubmitFreetext,
    isOpen,
    lexicalNodes,
    options,
    parseContentNode,
    renderCancelButton,
    renderInsertButton,
    renderReplaceButton,
    selection?.cursorPosition,
    selection?.rangeSelection,
    step,
    stepOutput,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <ThemeProvider>
      <div ref={containerRef}>{stepContent}</div>
    </ThemeProvider>
  );
};
