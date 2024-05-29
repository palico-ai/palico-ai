'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OPEN_ASK_AI_COMMAND } from '@palico-ai/lexical';
import { useHotkeys } from 'react-hotkeys-hook';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createParagraphNode, $insertNodes } from 'lexical';
import { ColumnDef } from '@tanstack/react-table';
import { ExperimentTest } from '@palico-ai/common';
import result from './result.json';
import { $createDataTableNode } from './nodes/data_table';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createColumns = (result: ExperimentTest['result']): ColumnDef<any>[] => {
  const allTags = new Set<string>();
  const allMetrics = new Set<string>();
  result.forEach((test) => {
    Object.keys(test.tags).forEach((tag) => allTags.add(tag));
    Object.keys(test.metrics).forEach((metric) => allMetrics.add(metric));
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staticColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'input.userMessage',
      header: 'User Message',
      // TODO: Add sub row for payload
    },
    {
      accessorKey: 'output.message',
      header: 'Agent Response',
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tagColumns: ColumnDef<any>[] = Array.from(allTags).map((tag) => ({
    accessorKey: `tags.${tag}`,
    header: `Tag: ${tag}`,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metricColumns: ColumnDef<any>[] = Array.from(allMetrics).map(
    (metric) => ({
      accessorKey: `metrics.${metric}`,
      header: `Metric: ${metric}`,
    })
  );
  return staticColumns.concat(tagColumns).concat(metricColumns);
};

const columns = createColumns(result as any);

const HotKeyPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useHotkeys(
    'alt+t',
    (e) => {
      e.preventDefault();
      editor.update(() => {
        $insertNodes([$createDataTableNode({ data: result, columns })]);
      });
    },
    [editor],
    { enableOnContentEditable: true }
  );

  useHotkeys(
    'ctrl+i',
    () => {
      editor.dispatchCommand(OPEN_ASK_AI_COMMAND, {});
    },
    [editor],
    { enableOnContentEditable: true }
  );

  useHotkeys(
    'alt+1',
    (e) => {
      e.preventDefault();
      editor.update(() => {
        $insertNodes([$createHeadingNode('h1')]);
      });
    },
    [editor],
    { enableOnContentEditable: true }
  );

  useHotkeys(
    'alt+2',
    (e) => {
      e.preventDefault();
      editor.update(() => {
        $insertNodes([$createHeadingNode('h2')]);
      });
    },
    [editor],
    { enableOnContentEditable: true }
  );

  useHotkeys(
    'alt+3',
    (e) => {
      e.preventDefault();
      editor.update(() => {
        $insertNodes([$createHeadingNode('h3')]);
      });
    },
    [editor],
    { enableOnContentEditable: true }
  );

  useHotkeys(
    'alt+p',
    (e) => {
      e.preventDefault();
      editor.update(() => {
        $insertNodes([$createParagraphNode()]);
      });
    },
    [editor],
    { enableOnContentEditable: true }
  );

  return null;
};

export default HotKeyPlugin;
