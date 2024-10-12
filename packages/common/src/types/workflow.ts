import { JSONAbleObject, QueueJobStatus } from './common';

export interface WorkflowNodeSerialized {
  id: string;
}

export interface WorkflowEdge {
  sourceNodeId: string;
  targetNodeId: string;
}

export interface WorkflowGraphSerialized {
  nodes: WorkflowNodeSerialized[];
  edges: WorkflowEdge[];
}

export interface WorkflowExecution {
  conversationId: string;
  requestId: string;
  workflowName: string;
  graph: WorkflowGraphSerialized;
  executionStack: JSONAbleObject[];
  status: QueueJobStatus;
  createdAt: string;
  updatedAt: string;
}
