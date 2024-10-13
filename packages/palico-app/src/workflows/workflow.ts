import { AgentRequestContent } from '@palico-ai/common';
import {
  ChainNode,
  ChainNodeRequestHandler,
  ResultNodeRequestHandler,
} from './types';

export interface AppendHandlerParams {
  mapInput?: Record<string, string>;
  mapOutput?: Record<string, string>;
}

export interface ChainWorkflowCreateParams {
  nodes: ChainNode[];
  resultParser: ResultNodeRequestHandler;
}

class ChainWorkflowBuilder {
  private readonly nodes: ChainNode[];

  constructor(starterNode: ChainNode) {
    this.nodes = [starterNode];
  }

  static create(
    name: string,
    handler: ChainNodeRequestHandler<AgentRequestContent>,
    params?: AppendHandlerParams
  ) {
    const root: ChainNode<AgentRequestContent> = {
      name,
      handler,
      mapInput: params?.mapInput,
      mapOutput: params?.mapOutput,
    };
    return new ChainWorkflowBuilder(root);
  }

  link(
    name: string,
    handler: ChainNodeRequestHandler,
    params?: AppendHandlerParams
  ) {
    const node: ChainNode = {
      name,
      handler,
      mapInput: params?.mapInput,
      mapOutput: params?.mapOutput,
    };
    const lastNode = this.nodes[this.nodes.length - 1];
    lastNode.next = node;
    this.nodes.push(node);
    return this;
  }

  send(handler: ResultNodeRequestHandler) {
    return new ChainWorkflow({ nodes: this.nodes, resultParser: handler });
  }
}

export class ChainWorkflow {
  readonly nodes: ChainNode[];
  readonly resultParser: ResultNodeRequestHandler;
  static create = ChainWorkflowBuilder.create;

  constructor(params: ChainWorkflowCreateParams) {
    this.nodes = params.nodes;
    this.resultParser = params.resultParser;
  }
}
