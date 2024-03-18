/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useMemo } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getNodeByKey,
  $getSelection,
  BaseSelection,
} from 'lexical';
import { computePositionAtSelection } from './utils/use_compute_float';
import { AIAction } from './types';
import { useHotkeys } from 'react-hotkeys-hook';
import { ElementAbsoluteCoordinate } from './plugin';
import { ContentNode } from './utils/use_content_node_parser';

export enum Step {
  SelectMenuItem,
  AddFreeText,
  PreviewGeneration,
}

export type StepOutput = {
  [Step.SelectMenuItem]?: {
    action: AIAction;
    optionValue?: string;
  };
  [Step.AddFreeText]?: string | undefined;
  [Step.PreviewGeneration]?: ContentNode[] | undefined;
};

export type LexicalAISelection = {
  selection: BaseSelection;
  lastNodeKey: string;
  rangeSelection?: {
    selectionKeys: string[];
    selectedText: string;
  };
  cursorPosition: ElementAbsoluteCoordinate;
};

type HandleCloseParams = {
  dontRestoreSelection?: boolean;
}

export type LexicalAITypeaheadContextProps = {
  isOpen: boolean;
  handleClose: (params?: HandleCloseParams) => void;
  actions: AIAction[];
  activeStep?: Step;
  setActiveStep: (step?: Step) => void;
  stepValue: StepOutput;
  setStepValue: (value: StepOutput) => void;
  selection?: LexicalAISelection;
};

export const LexicalAITypeaheadContext =
  React.createContext<LexicalAITypeaheadContextProps>({
    isOpen: false,
    handleClose: () => {},
    actions: [],
    setActiveStep: () => {},
    stepValue: {},
    setStepValue: () => {},
  });

export interface LexicalAITypeaheadProviderProps {
  actions: AIAction[];
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// For testing purposes
const testPreviewContent: ContentNode[] = JSON.parse(
  "[\n  {\n    \"type\": \"heading1\",\n    \"value\": \"The Wonderful World of Cats\"\n  },\n  {\n    \"type\": \"paragraph\",\n    \"value\": \"Cats have been a beloved companion to humans for centuries, captivating us with their mysterious and independent nature. From their playful antics to their soothing purrs, cats have a special place in our hearts.\"\n  },\n  {\n    \"type\": \"heading2\",\n    \"value\": \"The History of Cats\"\n  },\n  {\n    \"type\": \"paragraph\",\n    \"value\": \"Cats have a rich history, dating back to ancient Egypt where they were revered as sacred animals. Over time, cats have been both worshipped and feared, with their enigmatic presence leaving a lasting impression on cultures around the world.\"\n  },\n  {\n    \"type\": \"heading2\",\n    \"value\": \"The Unique Personalities of Cats\"\n  },\n  {\n    \"type\": \"paragraph\",\n    \"value\": \"One of the most fascinating aspects of cats is their diverse personalities. From the adventurous explorer to the laid-back cuddler, each cat has its own distinct character that brings joy and companionship to their human families.\"\n  },\n  {\n    \"type\": \"heading2\",\n    \"value\": \"Caring for Your Feline Friend\"\n  },\n  {\n    \"type\": \"paragraph\",\n    \"value\": \"Caring for a cat involves providing a safe and stimulating environment, regular veterinary care, and plenty of love and attention. Understanding a cat's unique needs and behaviors is essential for building a strong and fulfilling bond.\"\n  }\n]"
);

const DEFAULT_VALUE = {
  STEP_OUTPUT: {
    [Step.PreviewGeneration]: testPreviewContent,
  },
  STEP: Step.PreviewGeneration,
  // STEP: Step.SelectMenuItem,
};

export const LexicalAITypeaheadProvider: React.FC<
  LexicalAITypeaheadProviderProps
> = ({ isOpen, onClose, children, actions }) => {
  const [activeStep, setActiveStep] = React.useState<Step | undefined>();
  const [stepValue, setStepValue] = React.useState<StepOutput>(
    DEFAULT_VALUE.STEP_OUTPUT
  );
  const [editor] = useLexicalComposerContext();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selection, setSelection] = React.useState<LexicalAISelection>();

  const handleClose = (params?: HandleCloseParams) => {
    onClose();
    if (params?.dontRestoreSelection) {
      console.log("Not restoring selection")
      return;
    }
    tryRestoreSelection();
  };

  useHotkeys('esc', () => {
    handleClose();
  }, {
    enableOnContentEditable: true,
    enableOnFormTags: true,
  });

  useEffect(() => {
    const calculateSelection = () => {
      const rootElement = editor._rootElement;
      if (!rootElement) return;
      editor.getEditorState().read(() => {
        const selection = getSelection();
        const lexSelection = $getSelection();
        if (!lexSelection) return;
        const selectionNodes = lexSelection.getNodes();
        const rangeSelection = lexSelection.isCollapsed()
          ? undefined
          : {
              selectedText: lexSelection.getTextContent() || '',
              selectionKeys: selectionNodes.map((node) => node.getKey()),
            };
        if (!selection || !containerRef.current) return;
        computePositionAtSelection(selection, containerRef.current, {
          placement: 'bottom-start',
        }).then((position) => {
          if (!position) return;
          setSelection({
            selection: lexSelection,
            cursorPosition: position,
            lastNodeKey: selectionNodes[selectionNodes.length - 1].getKey(),
            rangeSelection,
          });
        });
      });
    };

    const resetDefaultState = () => {
      setActiveStep(DEFAULT_VALUE.STEP);
      setStepValue(DEFAULT_VALUE.STEP_OUTPUT);
    };

    if (isOpen) {
      calculateSelection();
      resetDefaultState();
    }
  }, [editor, isOpen]);

  const tryRestoreSelection = useCallback(() => {
    editor.update(() => {
      if (selection?.lastNodeKey) {
        try {
          const node = $getNodeByKey(selection.lastNodeKey);
          if(!node) return;
          node?.selectNext();
          node?.selectEnd();
        } catch (e) {
          console.error('Unable to restore selection');
          console.error(e);
        }
      }
    });
  }, [editor, selection?.lastNodeKey]);

  const openTimestamp = useMemo(() => {
    if (isOpen) {
      return Date.now();
    }
    return undefined
  }, [isOpen]);

  return (
    <LexicalAITypeaheadContext.Provider
      value={{
        isOpen,
        handleClose,
        setStepValue,
        actions,
        selection,
        activeStep,
        setActiveStep,
        stepValue,
      }}
    >
      <ClickAwayListener
        onClickAway={() => {
          if (!isOpen || !openTimestamp) return;
          const elapsed = Date.now() - openTimestamp;
          if (elapsed > 1000) {
            handleClose();
          }
        }}
      >
        <div ref={containerRef}>{children}</div>
      </ClickAwayListener>
    </LexicalAITypeaheadContext.Provider>
  );
};
