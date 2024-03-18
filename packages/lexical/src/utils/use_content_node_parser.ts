/* eslint-disable no-case-declarations */
import { $createParagraphNode, $createTextNode, LexicalNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { useCallback, useMemo } from "react";
import { ParserOverrideProps } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ContentNode<Value = any> {
  type: string;
  value: Value;
}

export type ContentNodeParserFN = (entry: ContentNode) => LexicalNode[];

export const H1NodeParser : ContentNodeParserFN = (entry) => {
  const heading = $createHeadingNode("h1");
  heading.append($createTextNode(entry.value));
  return [heading];
}

export const H2NodeParser : ContentNodeParserFN = (entry) => {
  const heading = $createHeadingNode("h2");
  heading.append($createTextNode(entry.value));
  return [heading];
}

export const H3NodeParser : ContentNodeParserFN = (entry) => {
  const heading = $createHeadingNode("h3");
  heading.append($createTextNode(entry.value));
  return [heading];
}

export const ParagraphNodeParser : ContentNodeParserFN = (entry) => {
  const paragraph = $createParagraphNode();
  paragraph.append($createTextNode(entry.value));
  return [paragraph];
}

export const DefaultContentNodeParsers: Record<string, ContentNodeParserFN> = {
  heading1: H1NodeParser,
  heading2: H2NodeParser,
  heading3: H3NodeParser,
  paragraph: ParagraphNodeParser,
};

export const DefaultInvalidTypeParser: ContentNodeParserFN = (entry) => {
  console.error("Unknown content type: ", entry.type)
  const paragraph = $createParagraphNode();
  paragraph.append($createTextNode(entry.value));
  return [paragraph];
}

export type UseParseContentNodeParams = {
  setParsers?: ParserOverrideProps["contentParsers"];
  setInvalidTypeParser: ParserOverrideProps["setInvalidTypeParser"];
  customParsers?: ParserOverrideProps["additionalContentParsers"];

}

export type LexicalContentNodeParser = (content: ContentNode[]) => LexicalNode[];

export const useParseContentNode = (params: UseParseContentNodeParams) : LexicalContentNodeParser => {
  const { 
    setParsers,
    setInvalidTypeParser,
    customParsers
  } = params;

  const parsers = useMemo(() => {
    if (customParsers) {
      return {
        ...DefaultContentNodeParsers,
        ...customParsers,
      }
    }
    return setParsers ?? DefaultContentNodeParsers;
  }, [customParsers, setParsers]);

  const parse = useCallback((content: ContentNode[]): LexicalNode[] => {
    const nodes: LexicalNode[] = [];
    content.forEach((node) => {
      const parser = parsers[node.type] || setInvalidTypeParser;
      nodes.push(...parser(node));
    });
    return nodes;
  }, [parsers, setInvalidTypeParser]);

  return parse;
};
