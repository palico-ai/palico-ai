import {
  AppConfig,
  ConversationContext,
  JSONAbleObject,
} from '@palico-ai/common';
import { INode, TaskResponse } from './workflow';

type ChoiceWhen<Input, AC extends AppConfig> = (
  input: Input,
  context: ConversationContext<AC>
) => Promise<boolean>;

export class TaskNode<
  Input extends JSONAbleObject = JSONAbleObject,
  Payload extends JSONAbleObject = JSONAbleObject,
  AC extends AppConfig = AppConfig
> implements INode<Input, Payload, AC>
{
  id: string;
  nextNodes: INode[];

  constructor(
    id: string,
    private runner: (
      input: Input,
      context: ConversationContext<AC>
    ) => Promise<Payload>
  ) {
    this.id = id;
    this.nextNodes = [];
  }

  async run(
    input: Input,
    context: ConversationContext<AC>
  ): Promise<TaskResponse<Payload>> {
    const payload = await this.runner(input, context);
    return {
      payload,
      nextChainableId: this.nextNodes[0]?.id,
    };
  }

  next<T extends INode>(state: T): T {
    this.nextNodes = [state];
    return state;
  }
}

export class Choice<
  Input extends JSONAbleObject = JSONAbleObject,
  AC extends AppConfig = AppConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> implements INode<Input, any, AC>
{
  nextNodes: INode[];
  matchers: ChoiceWhen<Input, AC>[];
  defaultChoice?: INode;

  constructor(public id: string) {
    this.matchers = [];
    this.nextNodes = [];
  }

  /**
   * When a condition is met, go to the next state
   * @param matcher the function to determine if the condition is met
   * @param chain the next state to go to if the condition is met
   * @returns this instance
   */
  when(matcher: ChoiceWhen<Input, AC>, chain: INode): this {
    this.matchers.push(matcher);
    this.nextNodes.push(chain);
    return this;
  }

  /**
   * The default state to go to if no matchers are found
   * @param state state to go to if no matchers are found
   */
  otherwise(state: INode) {
    this.defaultChoice = state;
    this.nextNodes.push(state);
    return this;
  }

  async run(
    input: Input,
    context: ConversationContext<AC>
  ): Promise<TaskResponse<unknown>> {
    for (let i = 0; i < this.matchers.length; i++) {
      const isMatch = await this.matchers[i](input, context);
      if (isMatch) {
        return {
          payload: null,
          nextChainableId: this.nextNodes[i].id,
        };
      }
    }
    return {
      payload: null,
      nextChainableId: this.defaultChoice?.id ?? this.nextNodes[0].id,
    };
  }
}
