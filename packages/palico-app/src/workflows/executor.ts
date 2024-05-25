import { ConversationContext, ConversationRequestContent, ConversationResponseSchema } from "@palico-ai/common";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { uuid } from "../utils/common";
import { ChainNode } from "./types";
import {get as objGet, set as objSet} from 'lodash';
import WorkflowModel from "../models/workflow";

export interface RunWorkflowParams {
  workflowName: string;
  input: ConversationRequestContent;
  featureFlags?: Record<string, unknown>;
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
    context: ConversationContext
  ) {
    return await tracer.startActiveSpan(node.name, async (nodeSpan) => {
      try {
        const nodeInput = ChainWorkflowExecutor.getNodeInput(node, workflowInput);
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

  private static getFinalOutputMap(currentWorkflowInput: Record<string, unknown>, finalOutputMap?: Record<string, string>) {
    if(finalOutputMap) {
      return Object.keys(finalOutputMap).reduce((acc, key) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const value = objGet(currentWorkflowInput, finalOutputMap[key]);
        objSet(acc, key, value);
        return acc;
      }, {});
    }
    return currentWorkflowInput;
  }

  static async run(params: RunWorkflowParams) {
    const workflow = await WorkflowModel.getWorkflowByName(params.workflowName);
    const { input, featureFlags } = params;
    return await tracer.startActiveSpan('ChainWorkflow', async (span) => {
      try {
        span.setAttributes({
          input: JSON.stringify(input, null, 2),
        });
        const context: ConversationContext = {
          requestId: uuid(), // TODO: create a table to store requests
          featureFlags: featureFlags ?? {},
          otel: {
            traceId: span.spanContext().traceId,
          },
        };
        let workflowInput : Record<string, unknown> = input as Record<string, unknown>;
        let currentNode: ChainNode | undefined = workflow.nodes[0];
        while (currentNode) {
          const newWorkflowInput = await ChainWorkflowExecutor.runNode(
            currentNode,
            workflowInput as Record<string, unknown>,
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
        return finalOutput
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