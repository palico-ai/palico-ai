import {
  ConversationContext,
  JSONAbleObject,
  QueueJobStatus,
  WorkflowResponse,
} from '@palico-ai/common';
import WorkflowModel from './model';
import { INode, Workflow } from './workflow';
import { WorkflowExecutorRunParams } from './types';
import { getTracer, Logger } from '../telemetry';
import { WorkflowExecutionDataStore } from '../data_store/workflow_execution';

const tracer = getTracer('AgentExecutor');

export default class WorkflowExecutor {
  __workflow?: Workflow;

  constructor(private readonly name: string) {}

  async getWorkflow(): Promise<Workflow> {
    if (!this.__workflow) {
      const workflow = await WorkflowModel.getWorkflowByName(this.name);
      if (!workflow) {
        throw new Error(`Workflow ${this.name} not found`);
      }
      this.__workflow = workflow;
    }
    return this.__workflow;
  }

  async run(params: WorkflowExecutorRunParams): Promise<WorkflowResponse> {
    return await tracer.trace('WorkflowExecutor->run', async (span) => {
      const { requestId, conversationId, isNewConversation, input, appConfig } =
        params;
      span.setAttributes({
        workflowName: this.name,
        input: JSON.stringify(input, null, 2),
        appConfig: JSON.stringify(appConfig, null, 2),
      });
      try {
        await WorkflowExecutionDataStore.updateStatus(
          params.requestId,
          QueueJobStatus.ACTIVE
        );
        const output = await this.startRun(input, {
          conversationId,
          requestId,
          isNewConversation,
          appConfig: appConfig ?? {},
        });
        const responseOutput = {
          requestId,
          conversationId,
          data: output['data'],
          message: output['message'],
          output,
        };
        return responseOutput;
      } catch (e) {
        Logger.error('Error in WorkflowExecutor.run', e);
        throw e;
      }
    });
  }

  async runNode(
    node: INode,
    input: JSONAbleObject,
    context: ConversationContext
  ) {
    return await tracer.trace(
      `WorkflowExecutor->runNode(${node.id})`,
      async (span) => {
        span.setAttributes({
          nodeId: node.id,
          input: JSON.stringify(input, null, 2),
          context: JSON.stringify(context, null, 2),
        });
        try {
          const { payload, nextChainableId } = await node.run(input, context);
          return {
            payload,
            nextChainableId,
          };
        } catch (e) {
          Logger.error('Error in WorkflowExecutor.runNode', e);
          throw e;
        }
      }
    );
  }

  private async startRun(input: JSONAbleObject, context: ConversationContext) {
    const workflow = await this.getWorkflow();
    const root = workflow.definition();
    const graph = workflow.getGraph();
    const nodeIdToNode: Record<string, INode> = {};
    for (const node of graph.nodes) {
      nodeIdToNode[node.id] = node;
    }
    let currentNode: INode = root;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentInput: Record<string, any> = input;
    while (currentNode) {
      const { payload, nextChainableId } = await this.runNode(
        currentNode,
        currentInput,
        context
      );
      currentInput = {
        ...currentInput,
        ...payload,
      };
      currentNode = nodeIdToNode[nextChainableId];
    }
    return currentInput;
  }
}
