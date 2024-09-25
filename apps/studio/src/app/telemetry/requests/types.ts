import { ConversationRequestSpan } from '@palico-ai/common';

export interface RequestSpanTreeNode extends ConversationRequestSpan {
  children: RequestSpanTreeNode[];
}
