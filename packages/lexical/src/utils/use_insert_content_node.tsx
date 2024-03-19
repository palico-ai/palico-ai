import {
  $createLineBreakNode,
  $createNodeSelection,
  $getNodeByKey,
  $insertNodes,
  $setSelection,
  LexicalEditor,
  LexicalNode,
} from 'lexical';
import { useContext } from 'react';
import {
  ContentNode,
  LexicalContentNodeParser,
} from './use_content_node_parser';
import { LexicalAITypeaheadContext } from '../typeahead.context';

export type InsertContentNodeParams = {
  editor: LexicalEditor;
  parser: LexicalContentNodeParser;
};

export const useInsertContentNode = (params: InsertContentNodeParams) => {
  const { editor, parser } = params;
  const { selection } = useContext(LexicalAITypeaheadContext);

  const insertAfterLastNode = (nodes: LexicalNode[], lastNode: LexicalNode) => {
    let parentNode = lastNode;
    parentNode.selectStart();
    parentNode.selectEnd();
    if (lastNode.getTextContent().length === 0) {
      // If last node is empty, we should not add a line break
      $insertNodes(nodes);
      return;
    }
    nodes.forEach((node) => {
      parentNode.insertAfter(node);
      parentNode = node;
    });
  };

  const insertContentBelowSelection = async (contentNodes: ContentNode[]) => {
    editor.update(() => {
      const nodes = parser(contentNodes);
      if (!selection) {
        console.log('User did not select anything');
        $insertNodes(nodes);
        return;
      }
      const lastNode = $getNodeByKey(selection.lastNodeKey);
      if (!lastNode) {
        throw new Error('Selection not set');
      }
      insertAfterLastNode(nodes, lastNode);
      nodes[nodes.length - 1].selectStart();
      nodes[nodes.length - 1].selectEnd();
      return;
    });
  };

  const replaceSelectionWithContent = async (contentNodes: ContentNode[]) => {
    editor.update(() => {
      const rangeSelection = selection?.rangeSelection;
      if (!rangeSelection) {
        insertContentBelowSelection(contentNodes);
        return;
      }
      const nodeSelection = $createNodeSelection();
      rangeSelection.selectionKeys.forEach((key) => {
        nodeSelection.add(key);
      });
      $setSelection(nodeSelection);
      const nodes = parser(contentNodes);
      nodeSelection.insertNodes([$createLineBreakNode(), ...nodes]);
      // let parentNode = $getNodeByKey(rangeSelection.selectionKeys[0]);
    });
  };

  return {
    insertContentBelowSelection,
    replaceSelectionWithContent,
  };
};
