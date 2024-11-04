import {
  AgentRequestContext,
  AgentRequestContent,
  ConversationResponseSchema,
  JSONAbleObject,
} from '@palico-ai/common';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { uuid } from '../utils/common';
import { ChainNode } from './types';
import { get as objGet, set as objSet } from 'lodash';
import WorkflowModel from '../models/workflow';
import { ConversationTelemetryModel } from '../services/database/conversation_telemetry';

export interface RunWorkflowParams {
  workflowName: string;
  content: AgentRequestContent;
  conversationId?: string;
  appConfig?: JSONAbleObject;
  traceId?: string;
}

const tracer = trace.getTracer('chain-workflow-executor');

export default class ChainWorkflowExecutor {
  private static getNodeInput(
    node: ChainNode,
    workflowInput: Record<string, unknown>
  ) {
    let nodeInput = workflowInput;
    if (node.mapInput) {
      nodeInput = Object.keys(node.mapInput).reduce((acc, key) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = objGet(workflowInput, node.mapInput![key]);
        objSet(acc, key, value);
        return acc;
      }, {});
      return nodeInput;
    }
    return workflowInput;
  }

  private static createNewWorkflowInput(
    currentInput: Record<string, unknown>,
    result: Record<string, unknown>,
    mapOutput?: Record<string, string>
  ) {
    if (!mapOutput) {
      return {
        ...currentInput,
        ...result,
      };
    }
    return Object.keys(mapOutput).reduce((acc, key) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = objGet(result, mapOutput[key]);
      objSet(acc, key, value);
      return acc;
    }, currentInput);
  }

  private static async runNode(
    node: ChainNode,
    workflowInput: Record<string, unknown>,
    context: AgentRequestContext
  ) {
    return await tracer.startActiveSpan(node.name, async (nodeSpan) => {
      try {
        const nodeInput = ChainWorkflowExecutor.getNodeInput(
          node,
          workflowInput
        );
        nodeSpan.setAttributes({
          workflowInput: JSON.stringify(workflowInput, null, 2),
          nodeInput: JSON.stringify(nodeInput, null, 2),
        });
        const output = await node.handler(nodeInput, context);
        const newWorkflowInput = ChainWorkflowExecutor.createNewWorkflowInput(
          workflowInput,
          output,
          node.mapOutput
        );
        nodeSpan.setAttributes({
          nodeOutput: JSON.stringify(output, null, 2),
          newWorkflowInput: JSON.stringify(newWorkflowInput, null, 2),
        });
        return newWorkflowInput;
      } catch (e) {
        console.log(e);
        nodeSpan.setStatus({
          code: SpanStatusCode.ERROR,
          message: e instanceof Error ? e.message : 'An error occurred',
        });
        throw e;
      } finally {
        nodeSpan.end();
      }
    });
  }

  static async execute(params: RunWorkflowParams) {
    return await tracer.startActiveSpan('ChainWorkflow', async (span) => {
      try {
        span.setAttributes({
          input: JSON.stringify(params.content, null, 2),
        });
        const conversationId = params.conversationId || uuid();
        const requestId = uuid();
        const traceId = params.traceId || span.spanContext().traceId;
        const workflow = await WorkflowModel.getWorkflowByName(
          params.workflowName
        );
        const context: AgentRequestContext = {
          conversationId,
          isNewConversation: params.conversationId === undefined,
          requestId,
          appConfig: params.appConfig ?? {},
        };
        let workflowInput: Record<string, unknown> = params.content as Record<
          string,
          unknown
        >;
        let currentNode: ChainNode | undefined = workflow.nodes[0];
        while (currentNode) {
          const newWorkflowInput = await ChainWorkflowExecutor.runNode(
            currentNode,
            workflowInput,
            context
          );
          workflowInput = newWorkflowInput;
          currentNode = currentNode.next;
        }
        span.setAttributes({
          output: JSON.stringify(workflowInput, null, 2),
        });
        // TODO: Validate output is a ConversationResponse using zod
        const finalOutput = await workflow.resultParser(workflowInput, context);
        await ConversationResponseSchema.parseAsync(finalOutput);
        await ConversationTelemetryModel.logRequest({
          conversationId,
          requestId,
          traceId,
          appConfig: params.appConfig,
          agentName: params.workflowName,
          requestInput: params.content,
          responseOutput: finalOutput,
        });
        return finalOutput;
      } catch (e) {
        console.log(e);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: e instanceof Error ? e.message : 'An error occurred',
        });
        throw e;
      } finally {
        span.end();
      }
    });
  }
}
