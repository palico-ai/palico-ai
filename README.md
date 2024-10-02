<div align="center">

# Palico AI - LLM Tech Stack for Rapid Iteration
[![Docs](https://img.shields.io/badge/docs-palico?style=flat&label=palico)](https://docs.palico.ai/)
[![Website](https://img.shields.io/badge/website-palico?style=flat&label=palico)](https://www.palico.ai/)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/PalicoAI)](https://x.com/PalicoAI)
[![NPM Version](https://img.shields.io/npm/v/@palico-ai/app)](https://www.npmjs.com/package/@palico-ai/app)
[![GitHub License](https://img.shields.io/github/license/palico-ai/palico-ai)](https://github.com/palico-ai/palico-ai/blob/main/LICENSE)
<br>
</div

Building an LLM application requires continously trying out different ideas (models, prompts, architectures). Palico provides you with an integrated tech stack that helps you quickly iterate on your LLM development.

#### With Palico you can

- ✅&nbsp; **Build** any application -- with complete flexibility -- in code ([docs](https://docs.palico.ai/guides/build))
- ✅&nbsp; **Integrate** with any external libraries like LangChain, LlamaIndex, Portkey, and more ([docs](https://docs.palico.ai/integrations/langchain)) <br>
- ✅&nbsp; **Preview changes** from localhost with Playground UI ([docs](https://docs.palico.ai/guides/preview_changes)) <br>
- ✅&nbsp; **Improve performance** with Experiments ([docs](https://docs.palico.ai/guides/experiments)) <br>
- ✅&nbsp; Debug isues with **request tracing** ([docs](https://docs.palico.ai/guides/telemetry)) <br>
- ✅&nbsp; Deploy your app behind a **REST API** ([docs](https://docs.palico.ai/guides/client_sdk)) <br>
- ✅&nbsp; Manage your application with UI **control panel** ([docs](https://docs.palico.ai/components#palico-studio)) <br>

> [!TIP]
>  ⭐️ **Star this repo** to get release notifications for new features.

#### 🕑 Get started in seconds
```bash
npx palico init <project-name>
```

Checkout our [quickstart guide](https://docs.palico.ai/).

## 📖 Documentation
For full documentation, checkout [docs.palico.ai](https://docs.palico.ai)

## 💻 Overview of your Palico Starter Application

https://github.com/palico-ai/palico-main/assets/32821894/54f35583-41c1-48a3-9565-95c484a4909b

## 🛠️ Building with Palico

### Build with complete flexiblity

### Integrates with your favorite tools

### Instantly preview your changes

### Easily swap models, prompts, anything and everything

## Improving Performance



## Going to Production

## 🧱 Components of a Palico Application

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
