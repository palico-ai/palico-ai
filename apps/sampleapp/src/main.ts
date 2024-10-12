/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ConversationFormat, Workflow } from '@palico-ai/app';

class MyWorkflow extends Workflow {
  step1 = this.task('step 1', async (input, context) => {
    console.log('Step 1');
    return {
      step1: 'Step 1',
    };
  });

  step2 = this.task('step 2', async (input, context) => {
    console.log('Step 2');
    return {
      step2: 'Step 2',
    };
  });

  step3 = this.task('Step 3', async (input, context) => {
    console.log('Step 3');
    return {
      step3: 'Step 3',
    };
  });

  step4 = this.task('step4', async (input, context) => {
    console.log('Step 4');
    return {
      step4: 'Step 4',
    };
  });

  formatStep = this.format<ConversationFormat>('Format Step', async (input) => {
    console.log('Format Step');
    return {
      message: 'Formatted',
      data: input,
    };
  });

  definition() {
    this.step1
      .next(this.step2)
      .next(this.step3)
      .next(
        this.choice('Choice')
          .when(async () => {
            const random = Math.random();
            if (random < 0.25) {
              return true;
            }
          }, this.step2)
          .when(async () => {
            const random = Math.random();
            if (random >= 0.25) {
              return true;
            }
          }, this.step3)
          .otherwise(this.step4)
      );
    this.step4.next(this.formatStep);
    return this.step1;
  }
}

const runner = async () => {
  const workflow = new MyWorkflow();
  const response = await workflow.run({
    input: {
      name: 'Hello',
    },
    appConfig: {
      model: 'gpt35',
    },
  });
  console.log(response);
};

runner();
