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

export type LexicalAITypeaheadContextProps = {
  isOpen: boolean;
  handleClose: () => void;
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
  '[{ "type": "heading1", "value": "A Long Poem" },\n{ "type": "paragraph", "value": "In the vast expanse of time and space," },\n{ "type": "paragraph", "value": "Where stars twinkle and planets race," },\n{ "type": "paragraph", "value": "There lies a tale of love and woe," },\n{ "type": "paragraph", "value": "Of joy and sorrow, high and low." },\n{ "type": "paragraph", "value": "From mountains high to oceans deep," },\n{ "type": "paragraph", "value": "The secrets of the world we keep," },\n{ "type": "paragraph", "value": "In every whisper of the wind," },\n{ "type": "paragraph", "value": "In every story that\'s ever been." },\n{ "type": "paragraph", "value": "So let me weave a tale for you," },\n{ "type": "paragraph", "value": "Of heroes brave and battles true," },\n{ "type": "paragraph", "value": "Of love that conquers all it meets," },\n{ "type": "paragraph", "value": "And hope that never knows defeat." },\n{ "type": "paragraph", "value": "For in this world of light and dark," },\n{ "type": "paragraph", "value": "We find our strength, our inner spark," },\n{ "type": "paragraph", "value": "To rise above and reach the stars," },\n{ "type": "paragraph", "value": "And write our names on history\'s scars." },\n{ "type": "paragraph", "value": "So let this poem be a guide," },\n{ "type": "paragraph", "value": "Through life\'s tumultuous, wild ride," },\n{ "type": "paragraph", "value": "To find the beauty in the pain," },\n{ "type": "paragraph", "value": "And dance with joy in pouring rain." }]'
);

const DEFAULT_VALUE = {
  STEP_OUTPUT: {
    [Step.PreviewGeneration]: testPreviewContent,
  },
  // STEP: Step.PreviewGeneration,
  STEP: Step.SelectMenuItem,
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

  const handleClose = () => {
    tryRestoreSelection();
    onClose();
  };

  useHotkeys('esc', handleClose, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
          if (elapsed > 100) {
            handleClose();
          }
        }}
      >
        <div ref={containerRef}>{children}</div>
      </ClickAwayListener>
    </LexicalAITypeaheadContext.Provider>
  );
};
