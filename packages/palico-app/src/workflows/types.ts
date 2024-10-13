import { AgentRequestContext, AgentResponse } from '@palico-ai/common';

export type ChainNodeRequestHandler<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Input = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Output = any
> = (input: Input, context: AgentRequestContext) => Promise<Output>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResultNodeRequestHandler<Input = any> = ChainNodeRequestHandler<
  Input,
  AgentResponse
>;

/**
 * ChainNode is a node in a chain workflow.
 * - mapInput: map workflow input to node input.
 *    Ex: { 'nodeInput': 'workflowInput' }. For nested objects, use dot notation.
 *    Ex: { 'nodeInput.nested': 'workflowInput.nested' }
 * - mapOutput: map node output to workflow input.
 */
export interface ChainNode<
  Input = Record<string, unknown>,
  Output = Record<string, unknown>,
  NextInput = Record<string, unknown>,
  NextOutput = Record<string, unknown>
> {
  name: string;
  handler: ChainNodeRequestHandler<Input, Output>;
  next?: ChainNode<NextInput, NextOutput>;
  mapInput?: Record<string, string>;
  mapOutput?: Record<string, string>; // map node output to workflow input
}
