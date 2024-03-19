import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
} from '@mui/material';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { HeadingNode } from '@lexical/rich-text';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import LexicalPreviewContent from './lexical_preview_content';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  PreviewLexicalEditorOverrides,
  PreviewUIOverrideProps,
} from '../../types';
import {
  ContentNode,
  LexicalContentNodeParser,
} from '../../utils/use_content_node_parser';

const editorConfig: InitialConfigType = {
  namespace: '',
  editable: false,
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
};

interface RenderPreviewProps
  extends PreviewUIOverrideProps,
    PreviewLexicalEditorOverrides {
  content: ContentNode[];
  enableReplace: boolean;
  lexicalContentNodeParser: LexicalContentNodeParser;
  onSelectInsertBelow: () => Promise<void>;
  onSelectReplace: () => Promise<void>;
  onSelectCancel: () => Promise<void>;
}

const RenderPreview: React.FC<RenderPreviewProps> = ({
  content,
  lexicalContentNodeParser,
  onSelectInsertBelow: onSelectInsert,
  enableReplace,
  lexicalNodes,
  additionalLexicalNodesNodes,
  editorTheme,
  onSelectReplace,
  onSelectCancel,
  renderCancelButton,
  renderInsertButton,
  renderReplaceButton,
}) => {
  const [loading, setLoading] = React.useState(false);

  useHotkeys('enter', () => {
    onSelectInsert();
  });

  useHotkeys('shift+enter', () => {
    onSelectReplace();
  });

  const cancelButton = useMemo(() => {
    const handleCancel = async () => {
      try {
        setLoading(true);
        await onSelectCancel();
      } finally {
        setLoading(false);
      }
    };

    if (renderCancelButton) {
      return renderCancelButton(handleCancel, {
        isLoading: loading,
      });
    }
    return (
      <Button
        disabled={loading}
        variant="contained"
        color="secondary"
        onClick={handleCancel}
      >
        Cancel [Esc]
      </Button>
    );
  }, [loading, onSelectCancel, renderCancelButton]);

  const insertButton = useMemo(() => {
    const handleInsert = async () => {
      try {
        setLoading(true);
        await onSelectInsert();
      } finally {
        setLoading(false);
      }
    };

    if (renderInsertButton) {
      return renderInsertButton(handleInsert, {
        isLoading: loading,
      });
    }
    return (
      <Button
        disabled={loading}
        variant="contained"
        color="primary"
        onClick={handleInsert}
      >
        Insert [Enter]
      </Button>
    );
  }, [loading, onSelectInsert, renderInsertButton]);

  const replaceButton = useMemo(() => {
    const handleReplace = async () => {
      try {
        setLoading(true);
        await onSelectReplace();
      } finally {
        setLoading(false);
      }
    };

    if (renderReplaceButton) {
      return renderReplaceButton(handleReplace, { isLoading: loading });
    }
    return (
      <Button
        disabled={loading}
        variant="contained"
        color="secondary"
        onClick={handleReplace}
      >
        Replace [Shift + Enter]
      </Button>
    );
  }, [loading, onSelectReplace, renderReplaceButton]);

  const editorNodeConfig = useMemo(() => {
    if(lexicalNodes) {
      return lexicalNodes;
    }
    return [
      HeadingNode,
      ...(additionalLexicalNodesNodes ?? []),
    ];
  }, [additionalLexicalNodesNodes, lexicalNodes]);

  return (
    <Dialog
      open={true}
      onClose={onSelectCancel}
      scroll="paper"
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <LexicalComposer
          initialConfig={{
            ...editorConfig,
            nodes: editorNodeConfig,
            theme: editorTheme,
          }}
        >
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={<div />}
          />
          <LexicalPreviewContent
            content={content}
            lexicalContentNodeParser={lexicalContentNodeParser}
          />
        </LexicalComposer>
        <Divider sx={{ py: 1 }} />
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            p: 1,
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
          }}
        >
          {cancelButton}
          {enableReplace && replaceButton}
          {insertButton}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RenderPreview;
