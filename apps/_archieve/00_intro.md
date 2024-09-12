---
sidebar_position: 1
slug: /
---

# Introduction

## What is Palico?
LLM application by default has a lot of performance issues (accuracy / hallucinations, latency, cost). To improve its performance, developers need to be able to experiment with many variations of their build layer. This involves testing different prompt techniques, LLM models, RAG pipeline, and more. Since you need to trial-and-error so many components of your application, iterative development is key to building a performant LLM application.

Building an LLM Application has three core activities:

- **Building**: The components used to create the application such as prompt, LLM model, RAG, etc.
- **Experimenting**: Testing different variations of the build layer to improve the performance of the LLM application
- **Deploying**: Moving the LLM application to production, integrating with other services, and monitoring its performance

Palico is a framework that standardizes the lifecycle of building, experimenting, and deploying an LLM application such that you can maximize the speed of the iterative loop for developing an LLM application that meets your performance targets.

## Components of a Palico Stack

### Agent
Agent is an `interface` that you wrap around your LLM Application. It helps you structure your LLM application for rapid experimentation. 

An agent generally consists of your logic for building your prompt, and calling an LLM model. As this is defined in-code, you can virtually use any external libraries or services such as LangChain, LlamaIndex, Portkey, etc. to help you build your LLM application.

```typescript
class MyLLMApp implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<LLMAgentResponse> {
    // ... your LLM application logic
  }
}
```
Read more about [Agents](./build_app/00_agents.md)

### Palico Studio
A UI Control Panel that runs locally on your machine during development to help you quickly test your application, compare responses, run experiments, and review traces.

Learn more about [Palico Studio](./build_app/01_studio.md)

### Playground
As part of Palico Studio, we provide few UI tools to help you quickly test your changes.
#### Chat with your Application
You can chat with your LLM application to quickly test your changes.
![Chat UI](../static/img/studio/chat_ui.png)
#### Compare Responses Side-by-Side
Quickly compare responses from different variations of your LLM application.
![Quick Lab](../static/img/studio/quicklab.png)

### Experimentation
Experiments helps you imperically evaluate the performance of your LLM application. Palico provides tools to help you run, manage, and analyze experiments.

Learn more about [Experiments](./build_app/02_experiments/01_intro.md)

#### Experiment Management
You can run and manage experiments from Palico Studio.
![Experiment List](../static/img/studio/experiment_list.png)

#### Experiment Analysis
You can analyze the results of your experiments from Palico Studio.
![Experiment Analysis](../static/img/studio/eval_compare.png)

### Tracing
Palico comes with built-in tracing out of the box. We provide our own tracing, but you can also add any custom tracing with OpenTelemetry.

You can view traces from Palico Studio.
![Trace List](../static/img/studio/trace_page.png)

Learn more about [Tracing](./build_app/03_tracing.md)

### Deployment

#### Docker
You can compile your Palico application into docker containers and deploy it to any cloud provider.

#### Client SDK
You can connect to your Palico application from any external service using our Client SDK or REST API. Read more about this in the [Client SDK](./build_app/10_sdk.md) section.

### Version Control
An LLM Stack is constantly evolving as you experiment with different variations of your LLM application. All your changes and experiments are automatically versioned and stored in git. This allows you to easily understand the history of your LLM application and collaborate with your team.

## Getting Started

You can get started by following the [installation guide](./getting_started/00_installation.mdx) or get familiar with all the core concepts of Palico by running through the [tutorial](./tutorials/00_intro.md).

