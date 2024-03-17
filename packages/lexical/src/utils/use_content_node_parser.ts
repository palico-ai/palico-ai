/* eslint-disable no-case-declarations */
import { $createParagraphNode, $createTextNode, LexicalNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ContentNode<Value = any> {
  type: string;
  value: Value;
}

export type ContentNodeParser = (entry: ContentNode) => LexicalNode[];

export const H1NodeParser : ContentNodeParser = (entry) => {
  const heading = $createHeadingNode("h1");
  heading.append($createTextNode(entry.value));
  return [heading];
}

export const H2NodeParser : ContentNodeParser = (entry) => {
  const heading = $createHeadingNode("h2");
  heading.append($createTextNode(entry.value));
  return [heading];
}

export const H3NodeParser : ContentNodeParser = (entry) => {
  const heading = $createHeadingNode("h3");
  heading.append($createTextNode(entry.value));
  return [heading];
}

export const ParagraphNodeParser : ContentNodeParser = (entry) => {
  const paragraph = $createParagraphNode();
  paragraph.append($createTextNode(entry.value));
  return [paragraph];
}

export const DefaultContentNodeParsers: Record<string, ContentNodeParser> = {
  heading1: H1NodeParser,
  heading2: H2NodeParser,
  heading3: H3NodeParser,
  paragraph: ParagraphNodeParser,
};

export const DefaultInvalidTypeParser: ContentNodeParser = (entry) => {
  console.error("Unknown content type: ", entry.type)
  const paragraph = $createParagraphNode();
  paragraph.append($createTextNode(entry.value));
  return [paragraph];
}

export interface UseParseContentNodeParams {
  parsers?: Record<string, ContentNodeParser>;
  parseInvalidType?: ContentNodeParser;
}

export type LexicalContentNodeParser = (content: ContentNode[]) => LexicalNode[];

export const useParseContentNode = (params: UseParseContentNodeParams) : LexicalContentNodeParser => {
  const { 
    parsers = DefaultContentNodeParsers, 
    parseInvalidType = DefaultInvalidTypeParser 
  } = params;

  const parse = useCallback((content: ContentNode[]): LexicalNode[] => {
    const nodes: LexicalNode[] = [];
    content.forEach((node) => {
      const parser = parsers[node.type] || parseInvalidType;
      nodes.push(...parser(node));
    });
    return nodes;
  }, [parseInvalidType, parsers]);

  return parse;
};
