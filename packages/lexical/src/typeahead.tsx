import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useCallback, useContext, useMemo } from 'react';
import PromptFreetext from './steps/prompt_freetext';
import {
  getDefaultRequestParams,
  getRequestParamForAction,
  useQueryAgent,
} from './utils/request';
import {
  $createLineBreakNode,
  $createNodeSelection,
  $getNodeByKey,
  $insertNodes,
} from 'lexical';
import RenderPreview from './steps/preview';
import { DefaultContentNodeParsers, useParseContentNode } from './utils/use_content_node_parser';
import { LexicalAITypeaheadContext, Step } from './typeahead.context';
import PromptSelectAIAction, { OnSelectParams } from './steps/select_action';
import {
  AIAction,
  AskAgentRequestParams,
  LexicalAIPluginUserOverrideProps,
} from './types';
import { useShowError } from './utils/useShowError';
import ThemeProvider from './theme';

export type LexicalAITypeaheadProps = LexicalAIPluginUserOverrideProps

export const LexicalAITypeahead: React.FC<LexicalAITypeaheadProps> = ({
  renderCancelButton,
  renderInsertButton,
  renderReplaceButton,
  setParsers,
  customParsers: addParsers,
  setInvalidTypeParser,
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
  const { askAgent } = useQueryAgent({
    apiURL: 'http://localhost:8000',
    serviceKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50SWQiOi0xLCJpYXQiOjE3MDkzMzc2ODF9.VtDihjqMcviS37AsUJZSuIxrxNp5QXegmz26qf2QyK4',
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const parsers = useMemo(() => {
    if (addParsers) {
      return {
        ...DefaultContentNodeParsers,
        ...addParsers,
      }
    }
    return setParsers;
  }, [addParsers, setParsers]);
  const parseContentNode = useParseContentNode({
    parsers,
    parseInvalidType: setInvalidTypeParser,
  });
  const { showErrorMessage } = useShowError({ closeOnError: true });

  const callAgentAndShowPreview = useCallback(
    async (params: AskAgentRequestParams) => {
      const response = await askAgent(params.message, params.context);
      const content = response?.message.content;
      if (!content) {
        throw new Error('Invalid response from agent');
      }
      setStepOutput({
        ...stepOutput,
        [Step.PreviewGeneration]: JSON.parse(content as string),
      });
      setStep(Step.PreviewGeneration);
    },
    [askAgent, setStep, setStepOutput, stepOutput]
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
        const requestBody = getDefaultRequestParams({
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
    [
      callAgentAndShowPreview,
      selection?.rangeSelection?.selectedText,
      showErrorMessage,
      stepOutput,
    ]
  );

  const handleInsertBelowSelection = useCallback(async () => {
    editor.update(() => {
      if (!stepOutput[Step.PreviewGeneration]) {
        showErrorMessage('No preview content to insert', {
          consoleMessage:
            'No preview content to insert. This is likely due to a bug transitioning from the preview generation step to the insert below selection step.',
        });
        return;
      }
      if (!selection) {
        showErrorMessage('No selection', {
          consoleMessage:
            'No selection. This is likely due to a the state value on previous steps not being set correctly.',
        });
        return;
      }
      const nodes = parseContentNode(stepOutput[Step.PreviewGeneration]);
      console.log('nodes', nodes);
      const lastNode = $getNodeByKey(selection.lastNodeKey);
      if (lastNode) {
        lastNode.selectNext();
      }
      console.log('lastNode', lastNode);
      $insertNodes([$createLineBreakNode(), ...nodes]);
      handleClose();
    });
  }, [
    editor,
    handleClose,
    parseContentNode,
    selection,
    showErrorMessage,
    stepOutput,
  ]);

  const handleReplaceSelection = useCallback(async () => {
    editor.update(() => {
      const rangeSelection = selection?.rangeSelection;
      if (!rangeSelection) {
        handleInsertBelowSelection();
        return;
      }
      const nodeSelection = $createNodeSelection();
      rangeSelection.selectionKeys.forEach((key) => {
        nodeSelection.add(key);
      });
      if (!stepOutput[Step.PreviewGeneration]) {
        showErrorMessage('No preview content to insert', {
          consoleMessage:
            'No preview content to insert. This is likely due to a bug transitioning from the preview generation step to the insert below selection step.',
        });
        return;
      }
      const nodes = parseContentNode(stepOutput[Step.PreviewGeneration]);
      nodeSelection.insertNodes([$createLineBreakNode() ,...nodes]);
      handleClose();
    });
  }, [
    editor,
    handleClose,
    handleInsertBelowSelection,
    parseContentNode,
    selection?.rangeSelection,
    showErrorMessage,
    stepOutput,
  ]);

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
            renderCancelButton={renderCancelButton}
            renderInsertButton={renderInsertButton}
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
  }, [handleClose, handleInsertBelowSelection, handleReplaceSelection, handleSelectOption, handleSubmitFreetext, isOpen, options, renderCancelButton, renderInsertButton, renderReplaceButton, selection?.cursorPosition, selection?.rangeSelection, step, stepOutput]);

  if (!isOpen) {
    return null;
  }

  return (
    <ThemeProvider>
      <div ref={containerRef}>{stepContent}</div>
    </ThemeProvider>
  );
};
