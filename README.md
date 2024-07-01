# Palico AI - Maximize your LLM Application Performance

LLM Application development is extremely iterative, more so than any other types of development. This is because to improve an LLM application performance (accuracy, hallucinations, latency, cost), you need to trial and error various combinations of LLM models, prompt templates (e.g., few-shot, chain-of-thought), prompt context with different RAG architecture, try different agent architecture, and more. **There are thousands of combinations to try**. 

Palico is an LLM Development Framework that structures your application development for rapid experimentation so you can quickly iterate towards your accuracy targets.

#### With Palico you can

- [Build](#build) modular LLM Applications and Workflows so you can easily test different combination of models, prompts, context, business logic, and more.
- [Improve accuracy](#experiment) by running lots of experiments on different configuration of your application, and empirically evaluating your application performance
- [Deploy](#deploy) to any cloud provider with Docker
- [Integrate](#client-sdk) your LLM application with your other services via REST API or SDK
- [Trace](#tracing) runtime executions of your application to debug accuracy or hallucinations issues
- [Manage](#palico-studio) your LLM application via Palico Studio - your application control panel

#### We help you build a modular tech-stack built for rapid iteration

![image](https://github.com/palico-ai/palico-main/assets/32821894/22c1c3b1-2021-4531-8011-47b41ed422c4)




## Quick Start

Setup a simple starter application with an OpenAI Chatbot

1. Create a Palico App

   ```bash
   npx palico init <project-name>
   ```

2. Add your OpenAI API key to `.env` file. You can get your OpenAI API key from [OpenAI](https://platform.openai.com/api-keys)

   ```tsx
   OPENAI_API_KEY=<your-openai-api-key>
   ```

3. Initialize required services for your Palico App. You only need to run this once when you first setup a new Palico App in a new environment.

   ```tsx
   npm run bootstrap
   ```

4. Start your Palico App

   ```tsx
   npm start
   ```

You can now chat with your chatbot in the Palico Studio at http://localhost:5173/chat. You can also modify your chat application in `src/agents/chatbot/index.ts`.

### Overview of your Palico Starter App

https://github.com/palico-ai/palico-main/assets/32821894/54f35583-41c1-48a3-9565-95c484a4909b

## Components of a Palico Application

### Build

Palico let’s you build any LLM application. We provides you with complete flexibilities with any tools or libraries you want to use to build your LLM application with. The most basic building block of a Palico Application are `Agent`, which has a single method, `chat()`. Here’s an example of an Agent:

```tsx
class ChatbotAgent implements LLMAgent {
  static readonly NAME: string = __dirname.split('/').pop()!;

  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<LLMAgentResponse> {
    const { userMessage } = content;
    const { appConfig } = context;
    // Your LLM prompt + model call
    const response = await portkey.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a pirate' },
        { role: 'user', content: 'Hello' },
      ],
      model: appConfig.model,
    });
    return {
      messages: response.messages,
    };
  }
}
```

Note that we are using Portkey to make our LLM call. Similarly, you can use LangChain or LlamaIndex to help you build your prompt and manage your model calls.

Our goal is to help developers create a more modular system so they can easily test different configuration of their LLM system to find the best input combination. That is where the `appConfig` parameter comes in. Developers should treat this like a feature flag and use this to programmatically build a more modular LLM application.

In addition to Agents, we have `Workflows` for more complex control flows and multi-agent applications.

Read more about [Agents](https://docs.palico.ai/build_app/agents).

### Experiment

Experiments are how you iteratively improve the accuracy of your application. Experimentation has three steps.

#### Create your accuracy benchmark

Benchmark is basically outlining the expected behavior of your application. This consists of creating a list of test-cases where you define an input to your LLM application, and measuring it’s output. Here’s an example

```tsx
{
  input: {
    userMessage:
      'Given the equation 2x + 3 = 7, solve for x.',
  },
  tags: {
    category: 'math',
  },
  metrics: [
    new SemanticSimilarity([
      "Answer: x = 2",
      "x = 2",
      "2",
    ]),
  ],
}
```

You can use metrics that we provide out-of-the-box, or you can create your own custom metrics.

#### Run Evaluates

Evaluation is the process of running your LLM application with a specific `appConfig` , across a benchmark test-suite. Palico Studio helps manage these evaluations

https://github.com/palico-ai/palico-main/assets/32821894/3a9dc1c5-319b-4c0b-8096-845f34542ae9

### Analyze

This is the review process for understanding the impact a given change has had on your LLM application. This is often done by reviewing the output metrics of an LLM application and comparing it against other tests. We have built-in support for evaluation in Palico Studio, but you can also run your own analysis in Jupyter Notebook.

Read more about [Experiments](https://docs.palico.ai/build_app/experiments/intro).

### Deploy

Your Palico App compiles to bunch of docker containers, which you can easily deploy to any cloud provider

### Client SDK

We provide a ClientSDK that let’s you easily connect to your LLM Agents or Workflow from your other services

Read more about [Client SDK](https://docs.palico.ai/build_app/sdk).

### Tracing

We provide tracing out-of-the-box, and you can add any custom traces using OpenTelemetry

Read more about [Tracing](https://docs.palico.ai/build_app/tracing).

### Palico Studio

Palico Studio is your Control Panel for your Palico App. With Palico Studio you can:

- Chat with your LLM Agents or Workflows
- Compare responses side by side
- Manage experiments
- Review runtime traces

During development, Palico Studio runs on your local machine to help aide in your development. In production, you can use this control panel to monitor runtime analytics.

https://github.com/palico-ai/palico-main/assets/32821894/0423cd2d-e5cf-4589-855e-945fb3a5f392


Read more about [Palico Studio](https://docs.palico.ai/build_app/studio).

## FAQ

### How does libraries like LangChain compared to Palico

LangChain and LlamaIndex are more like libraries that helps you achieve different tasks with LLM Development. For example, they provide you tools to connect with different LLM providers, connect to vector database, create evaluations, and more. They are more like a swiss army knife that helps you achieve different tasks with LLM Development. It's up to you to use these tools to structure your LLM application development for maximum productivity.

We are a framework (not a library) that has strong opinions on how you should structure your LLM application development. Our opinion is biased towards accuracy improvement through rapid experimentations. With our framework, you have a standard process, and an integrated set of tools, that helps you build your LLM application, measure accuracy, and run experiments. These processes all work together to maximize experiment-ability of your LLM application so you can reach your accuracy goals faster.

As we are a framework and LangChain or LlamaIndex are libraries, you can directly use LangChain or LlamaIndex within our application to help with tasks such as calling LLM models or managing your RAG layer while using our framework to streamline your experimentation process.

### How does evaluation libraries compared to Palico

Evaluation frameworks are often just a tool to help you grade the response of your LLM application. They may provide some proprietary observability and tracing tools. They however do not help you structure your LLM application development for rapid experimentation. They do not help you build your LLM application. They do not help you deploy your LLM application. The responsibility you have when using an evaluation framework is you need to build your own experiment management system that helps you scale your experimentation process across your team. You will have lots of fragmented tools that you need to integrate together to get a full picture of your LLM application.

We are a more integrated framework that helps you build, scale experimentation, and deploy your LLM application. We provide a more integrated experience for your team to work on LLM applications.
