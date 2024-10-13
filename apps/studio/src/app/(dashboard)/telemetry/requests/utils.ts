import { RequestSpan } from '@palico-ai/common';
import { RequestSpanTreeNode } from './types';

export const createSpanTree = (spans: RequestSpan[]): RequestSpanTreeNode[] => {
  const spanMap: Record<string, RequestSpanTreeNode> = {};
  const rootSpans: RequestSpanTreeNode[] = [];

  // create a map of spanId to span tree node
  spans.forEach((span) => {
    const spanNode: RequestSpanTreeNode = {
      ...span,
      children: [],
    };
    spanMap[span.spanId] = spanNode;
  });

  // link children to parent
  Object.values(spanMap).forEach((spanNode) => {
    const { parentSpanId } = spanNode;
    if (!parentSpanId) {
      return;
    }
    const parentSpan = spanMap[parentSpanId];
    if (parentSpan) {
      parentSpan.children.push(spanNode);
    }
  });

  // find root spans
  Object.values(spanMap).forEach((spanNode) => {
    if (!spanNode.parentSpanId) {
      rootSpans.push(spanNode);
    } else if (!spanMap[spanNode.parentSpanId]) {
      rootSpans.push(spanNode);
    }
  });

  return rootSpans;
};
