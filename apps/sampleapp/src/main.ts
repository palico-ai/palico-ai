/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { TaskState, Workflow } from '@palico-ai/app';

class PrintTask extends TaskState<string, string> {
  message: string;
  constructor(id: string, message: string) {
    super(id);
    this.message = message;
  }

  async handler(input: string) {
    console.log(this.message);
    return this.message;
  }
}

const message1 = new PrintTask('message1', 'Hello, World!');
const message2 = new PrintTask('message2', 'Second message');
const message3 = new PrintTask('message3', 'Third message');

const workflowChain = message1.next(message2).next(message3);

const workflow = new Workflow(message1);

workflow.printNodeTree();
