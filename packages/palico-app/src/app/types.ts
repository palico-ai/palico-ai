import { WorkflowExecutorRunParams } from '../workflows';

export interface ApplicationWorkflowParams
  extends Omit<
    WorkflowExecutorRunParams,
    'conversationId' | 'requestId' | 'isNewConversation'
  > {
  workflowName: string;
  conversationId?: string;
  requestId?: string;
}
