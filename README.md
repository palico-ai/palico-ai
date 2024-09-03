# Palico AI - Rapidly Iterate on your LLM Development

LLM application by default has a lot of performance issues (accuracy / hallucinations, latency, cost). To improve its performance, developers need iterate through hundreds of combinations of prompts, models, RAG pipeline, and more. Since you need to test so many variation, a process is needed to help you efficiently iterate through these combinations. We provide the framework that helps you streamline this iterative process.

#### With Palico you can

- [Build](#build) an application layer where you can easily swap out different combination of models, prompts, and custom logic
- [Improve performance](#experiment) by benchmarking your performance and creating an iterative loop to improve it
- [Deploy](#deploy) your application to any cloud provider with docker
- [Integrate](#client-sdk) your application with your other services via REST APIs or SDKs
- [Manage](#palico-studio) your application via Palico Studio - a control panel for your application

#### Get started in seconds
```bash
npx palico init <project-name>
```

## Documentation
For full documentation, checkout [docs.palico.ai](https://docs.palico.ai)

Setup your own Palico app by following our [quickstart guide](https://docs.palico.ai/getting_started/installation)

## Overview of your Palico Starter Application

https://github.com/palico-ai/palico-main/assets/32821894/54f35583-41c1-48a3-9565-95c484a4909b

## Components of a Palico Application

### Build

Palico let’s you build any LLM application. You have complete control over your implementation details, and can utilize any external libraries. The most basic building block of a Palico Application are `Agent`, which has a single method, `chat()`. Here’s an example of an Agent:

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

Our goal is to help developers create modular application layer so they can easily test different configuration of their application logic. That is where the `appConfig` parameter comes in. Developers should treat this like a feature flag and use this to programmatically build a more modular application layer.

Read more about [Agents](https://docs.palico.ai/build_app/agents).

### Experiment

Experiments are how you iteratively improve the performance (accuracy, latency, cost) of your application. We help you setup an iterative loop so you can continously improve the performance of your application

![LandPageAssets-Page-2 drawio (7)](https://github.com/user-attachments/assets/493a578a-3c0d-4df8-8b98-8fb27bbde916)



Setting up an experiments has three steps.

#### Create your benchmark

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

#### Run an Evaluation

Evaluation is the process of running your LLM application with a specific specific configuration (e.g. certain LLM model x prompt technique), across a benchmark test-suite. AppConfig helps you quickly create these configurations and Palico Studio helps manage these evaluations through an UI.

https://github.com/palico-ai/palico-main/assets/32821894/3a9dc1c5-319b-4c0b-8096-845f34542ae9

#### Analyze

This is the review process for understanding the impact a given change has had on your LLM application. This is often done by reviewing the output metrics of an LLM application and comparing it against other tests. We have built-in support for running common analysis in Palico Studio, but you can also run your own analysis in Jupyter Notebook.

Read more about [Experiments](https://docs.palico.ai/build_app/experiments/intro).

### Deploy

Your Palico App compiles to docker images, which you can easily deploy to any cloud provider

### Client SDK

We provide a ClientSDK that let’s you easily connect to your LLM Agents or Workflow from your other services

Read more about [Client SDK](https://docs.palico.ai/build_app/sdk).

### Tracing

We provide tracing out-of-the-box, and you can add any custom traces using OpenTelemetry

Read more about [Tracing](https://docs.palico.ai/build_app/tracing).

### Palico Studio

Palico Studio is your Control Panel for your Palico App. During development, Palico Studio runs locally on your machine to help aide in your development. In production you can use this control panel to monitor runtime analytics. With Palico Studio you can:

- Chat with your LLM Application
- Compare responses side by side
- Manage experiments
- Review runtime traces

https://github.com/palico-ai/palico-main/assets/32821894/0423cd2d-e5cf-4589-855e-945fb3a5f392


Read more about [Palico Studio](https://docs.palico.ai/build_app/studio).
