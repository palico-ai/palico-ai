import {
  $createLineBreakNode,
  $createNodeSelection,
  $getNodeByKey,
  $insertNodes,
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

  const shouldAddLineBreak = (
    starterNode: LexicalNode,
    parentNode?: LexicalNode
  ) => {
    // If parent is an empty paragraph, we should not add a line break
    if (
      parentNode &&
      parentNode.__type === 'paragraph' &&
      parentNode.getTextContent().length === 0
    ) {
      console.log('Parent is an empty paragraph');
      return false;
    }
    if (
      starterNode.__type === 'heading' &&
      (parentNode?.__type === 'text' || parentNode?.__type === 'paragraph')
    ) {
      console.log('Starter is a heading and parent is a text or paragraph');
      return true;
    }
    return true;
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
        throw new Error('Last node not found');
      }
      const insertNodeList = [];
      console.log(lastNode);
      if (
        nodes.length > 0 &&
        shouldAddLineBreak(nodes[0], lastNode || undefined)
      ) {
        insertNodeList.push($createLineBreakNode());
      }
      insertNodeList.push(...nodes);
      console.log('Inserting nodes', insertNodeList);
      $insertNodes(insertNodeList);
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
      const nodes = parser(contentNodes);
      nodeSelection.insertNodes([$createLineBreakNode(), ...nodes]);
    });
  };

  return {
    insertContentBelowSelection,
    replaceSelectionWithContent,
  };
};
