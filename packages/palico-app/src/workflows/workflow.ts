import { AppConfig, ConversationContext } from '@palico-ai/common';

export interface TaskResponse<Payload> {
  payload: Payload;
  nextChainableId: string;
}

export interface ITask<Input, Payload, AC extends AppConfig = AppConfig> {
  run(
    input: Input,
    context: ConversationContext<AC>
  ): Promise<TaskResponse<Payload>>;
}

export interface IChainable {
  id: string;
  executor: ITask<unknown, unknown>;
  nextStates: IChainable[];
}

export abstract class TaskState<
  Input = any,
  Payload = any,
  AC extends AppConfig = any
> implements ITask<Input, Payload, AC>, IChainable
{
  id: string;
  executor: ITask<unknown, unknown, AppConfig>;
  nextStates: IChainable[];

  constructor(id: string) {
    this.id = id;
    this.executor = this;
    this.nextStates = [];
  }

  abstract handler(
    input: Input,
    context: ConversationContext<AC>
  ): Promise<Payload>;

  async run(
    input: Input,
    context: ConversationContext<AC>
  ): Promise<TaskResponse<Payload>> {
    const payload = await this.handler(input, context);
    return {
      payload,
      nextChainableId: this.nextStates[0].id,
    };
  }

  next(state: IChainable): IChainable {
    this.nextStates = [state];
    return state;
  }
}

export type ChoiceWhen<Input, AC extends AppConfig> = (
  input: Input,
  context: ConversationContext<AC>
) => Promise<boolean>;

export abstract class Choice<Input = any, AC extends AppConfig = any>
  implements IChainable, ITask<Input, any, AC>
{
  nextStates: IChainable[];
  matchers: ChoiceWhen<Input, AC>[];
  defaultChoice?: IChainable;
  executor: ITask<Input, any, AC>;

  constructor(public id: string) {
    this.matchers = [];
    this.nextStates = [];
    this.executor = this;
  }

  when(matcher: ChoiceWhen<Input, AC>, chain: IChainable): this {
    this.matchers.push(matcher);
    this.nextStates.push(chain);
    return this;
  }

  otherwise(state: IChainable): this {
    this.defaultChoice = state;
    this.nextStates.push(state);
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
          nextChainableId: this.nextStates[i].id,
        };
      }
    }
    return {
      payload: null,
      nextChainableId: this.defaultChoice?.id ?? this.nextStates[0].id,
    };
  }
}

export class Workflow {
  constructor(readonly startNode: IChainable) {}

  printNodeTree() {
    const nodeStack: IChainable[][] = [];
    let currentLevel = [this.startNode];
    nodeStack.push(currentLevel);
    while (currentLevel.length > 0) {
      const nextLevel: IChainable[] = [];
      for (const node of currentLevel) {
        nextLevel.push(...node.nextStates);
      }
      nodeStack.push(nextLevel);
      currentLevel = nextLevel;
    }
    console.log(this.startNode);
    nodeStack.forEach((level, index) => {
      console.log(
        `Level ${index}: ${level.map((node) => node.id).join('\t\t')}`
      );
    });
  }
}
