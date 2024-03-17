'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OPEN_ASK_AI_COMMAND } from '@palico-ai/lexical';
import { useHotkeys } from 'react-hotkeys-hook';

const HotKeyPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useHotkeys(
    'ctrl+i',
    () => {
      editor.dispatchCommand(OPEN_ASK_AI_COMMAND, {});
    },
    [editor],
    { enableOnContentEditable: true }
  );
  return null;
}

export default HotKeyPlugin