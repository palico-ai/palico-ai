import React, { useCallback, useMemo } from 'react';
import { AIAction } from '../types';
import FloatingContainer from '../utils/floating_container';
import { MenuItem, MenuList } from '@mui/material';
import { useShowError } from '../utils/useShowError';

export interface OnSelectParams {
  selectedOptionValue?: string;
}

export interface PromptSelectAIActionProps {
  actions: AIAction[];
  isRangeSelection: boolean;
  cursorPosition?: { x: number; y: number };
  onSelectAction: (action: AIAction, params: OnSelectParams) => Promise<void>;
}

const PromptSelectAIAction: React.FC<PromptSelectAIActionProps> = ({
  actions,
  cursorPosition,
  isRangeSelection,
  onSelectAction,
}) => {
  const [nestedActionSelected, setNestedActionSelected] =
    React.useState<AIAction>();
  const [loading, setLoading] = React.useState(false);
  const { showError } = useShowError({ closeOnError: true });

  const handleSelectAction = useCallback(
    async (action: AIAction, params: OnSelectParams = {}) => {
      try {
        setLoading(true);
        await onSelectAction(action, params);
      } catch (e) {
        const error = e instanceof Error ? e : new Error('An error occurred');
        showError(error);
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [onSelectAction, showError]
  );

  const menuItems = useMemo(() => {
    if (nestedActionSelected && nestedActionSelected.options) {
      return [
        <MenuItem
          key={'back'}
          onClick={() => setNestedActionSelected(undefined)}
        >
          Back
        </MenuItem>,
        nestedActionSelected.options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() =>
              handleSelectAction(nestedActionSelected, {
                selectedOptionValue: option.value,
              })
            }
          >
            {option.label}
          </MenuItem>
        )),
      ];
    }
    const availableActions = actions
      .filter((action) => {
        if (!isRangeSelection && action.requiresRangeSelection) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.requiresRangeSelection && !b.requiresRangeSelection) {
          return -1;
        }
        if (!a.requiresRangeSelection && b.requiresRangeSelection) {
          return 1;
        }
        return 0;
      });

    return availableActions.map((action) => (
      <MenuItem
        disabled={loading}
        key={action.name}
        onClick={() => {
          if (action.options) {
            setNestedActionSelected(action);
            return;
          }
          handleSelectAction(action);
        }}
      >
        {action.label || action.name}
      </MenuItem>
    ));
  }, [actions, handleSelectAction, isRangeSelection, loading, nestedActionSelected]);

  return (
    <FloatingContainer x={cursorPosition?.x} y={cursorPosition?.y}>
      <MenuList autoFocusItem>{menuItems}</MenuList>
    </FloatingContainer>
  );
};

export default PromptSelectAIAction;
