import { AppConfig, JSONAbleObject } from '@palico-ai/common';

export interface WorkflowExecutorRunParams {
  input: JSONAbleObject;
  appConfig?: AppConfig;
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
}
