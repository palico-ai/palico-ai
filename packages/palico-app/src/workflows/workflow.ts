import {
  AppConfig,
  ConversationContext,
  InputWithAppConfig,
  JSONAbleObject,
  RequestTemplate,
  WorkflowEdge,
  WorkflowGraphSerialized,
} from '@palico-ai/common';
import { Choice, TaskNode } from './node';

export interface TaskResponse<Payload> {
  payload: Payload;
  nextChainableId: string;
}

export interface INode<
  I extends JSONAbleObject = JSONAbleObject,
  O extends JSONAbleObject = JSONAbleObject,
  AC extends AppConfig = AppConfig
> {
  id: string;
  run: (input: I, context: ConversationContext<AC>) => Promise<TaskResponse<O>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nextNodes: INode<O, any, AC>[];
}

export interface WorkflowGraph {
  nodes: INode[];
  edges: WorkflowEdge[];
}

export interface ConversationFormat {
  data?: JSONAbleObject;
  message?: string;
}

export abstract class Workflow<AC extends AppConfig = AppConfig> {
  /**
   * Define the workflow
   * @returns The start node of the workflow
   */
  abstract definition(): INode;

  templates: RequestTemplate<InputWithAppConfig>[] = [];

  task<
    Input extends JSONAbleObject = JSONAbleObject,
    Payload extends JSONAbleObject = JSONAbleObject
  >(
    id: string,
    runner: (input: Input, context: ConversationContext<AC>) => Promise<Payload>
  ) {
    return new TaskNode(id, runner);
  }

  format<
    T extends JSONAbleObject,
    Input extends JSONAbleObject = JSONAbleObject
  >(
    id: string,
    runner: (input: Input, context: ConversationContext<AC>) => Promise<T>
  ) {
    return new TaskNode(id, runner);
  }

  choice<Input extends JSONAbleObject = JSONAbleObject>(id: string) {
    return new Choice<Input, AC>(id);
  }

  getGraph(): WorkflowGraph {
    const root = this.definition();
    const nodes: INode[] = [];
    const edges: WorkflowEdge[] = [];
    const visited = new Set<string>();
    const stack = [root];
    while (stack.length) {
      const node = stack.pop();
      if (!node || visited.has(node.id)) {
        continue;
      }
      visited.add(node.id);
      nodes.push(node);
      for (const next of node.nextNodes) {
        edges.push({ sourceNodeId: node.id, targetNodeId: next.id });
        stack.push(next);
      }
    }
    return { nodes, edges };
  }

  getSerializedGraph(): WorkflowGraphSerialized {
    const graph = this.getGraph();
    return {
      nodes: graph.nodes.map((node) => ({ id: node.id })),
      edges: graph.edges,
    };
  }
}
