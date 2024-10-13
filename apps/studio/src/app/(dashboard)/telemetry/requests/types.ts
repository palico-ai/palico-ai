import { RequestSpan } from '@palico-ai/common';

export interface RequestSpanTreeNode extends RequestSpan {
  children: RequestSpanTreeNode[];
}
