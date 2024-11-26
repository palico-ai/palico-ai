<a name="readme-top"></a>

<div align="center">

  # Palico AI - Tech-Stack for Iterative Development
  <h4>
    <p>
        <a href="https://docs.palico.ai">Documentation</a> |
        <a href="https://docs.palico.ai/quickstart">Quickstart</a> |
        <a href="https://docs.palico.ai/guides/agents">Agents</a> |
        <a href="https://docs.palico.ai/guides/conversation_state">Memory</a> |
        <a href="https://docs.palico.ai/guides/telemetry">Tracing</a> |
        <a href="https://docs.palico.ai/guides/experiments"> Evaluations</a> |
        <a href="https://docs.palico.ai/client-sdk/introduction">SDKs</a> |
        <a href="https://docs.palico.ai/guides/deployment">Deployment</a>
    <p>
  </h4>

  <div>
  
  ![NPM Downloads](https://img.shields.io/npm/d18m/%40palico-ai%2Fapp)
  ![NPM Version](https://img.shields.io/npm/v/@palico-ai/app)
  [![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/PalicoAI)](https://x.com/PalicoAI)
  ![GitHub Repo stars](https://img.shields.io/github/stars/palico-ai/palico-ai)
  ![GitHub License](https://img.shields.io/github/license/palico-ai/palico-ai)


  
  </div>
</div

Developing an LLM application requires continuously trying different combinations of models, prompts, RAG datasets, call chaining, custom code, and more. Palico helps you build a tech-stack designed for the iterative nature of LLM Development.

#### With Palico you can

- ✅&nbsp; Build any application with complete flexibility ([docs](https://docs.palico.ai/guides/build))
- ✅&nbsp; Preview changes locally with a Playground UI ([docs](https://docs.palico.ai/guides/build#preview-changes)) <br>
- ✅&nbsp; Improve performance with Experiments and Evals ([docs](https://docs.palico.ai/guides/experiments)) <br>
- ✅&nbsp; Debug issues with logs and traces ([docs](https://docs.palico.ai/guides/telemetry)) <br>
- ✅&nbsp; Integrate with your frontend with ClientSDKs or REST API ([docs](https://docs.palico.ai/client-sdk/introduction)) <br>
- ✅&nbsp; Setup Continous Integration and Pull-Request Previews ([docs](https://docs.palico.ai/guides/deployment)) <br>
- ✅&nbsp; Manage your application from a control panel ([docs](https://docs.palico.ai/components#palico-studio)) <br>

> [!TIP]
> ⭐️ **Star this repo** to get release notifications for new features.
>
> ![ezgif-4-c4cae043ed](https://github.com/user-attachments/assets/1e9cecd1-d459-4f47-96e4-ffd34a9aed15)

## ⚡ Get started in seconds ⚡

```bash
npx palico init <project-name>
```

Checkout our [quickstart](https://docs.palico.ai/) guide.

### Overview of your Palico App

https://github.com/user-attachments/assets/8c8a1c62-f70d-45a5-82f7-21b2073ba9f0

## 🛠️ Building your Application

### Build your application with complete flexibility

With Palico, you have complete control over the implementation details of your LLM application. Build any application by creating a `Chat` function.

```typescript src/agents/my_agent/index.ts {5,17}
import { Chat } from '@palico-ai/app';
import OpenAI from 'openai';

// 1. implement the Chat type
const handler: Chat = async ({ userMessage }) => {
  // 2. implement your application logic
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'user', content: userMessage }],
  });
  return {
    message: response.choices[0].message.content,
  };
};

// 3. export the handler
export default handler;
```

Learn more about building your application with palico ([docs](https://docs.palico.ai/guides/build)).

### Build complex interactions with powerful primitives

| Feature                                                               | Description                                                                           |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Streaming](https://docs.palico.ai/guides/streaming)                  | Stream messages, data, and intermediate steps to your client-app                      |
| [Memory Management](https://docs.palico.ai/guides/conversation_state) | Store conversation states between request without managing any storage infrastructure |
| [Tool Executions](https://docs.palico.ai/guides/agents)               | Build Agents that can execute tools on client-side and server-side                    |
| [Feature Flags](https://docs.palico.ai/guides/feature_flag)           | Easily swap models, prompts, RAG, and custom logic at runtime                         |
| [Monitoring](https://docs.palico.ai/guides/telemetry)                 | Debug issues with faster with comprehensive logs and traces                           |

### Integrates with your favorite tools and libraries

Since you own the implementation details, you can use Palico with most other external tools and libraries

|                                                                   | Tools or Libraries                                                            | Supported |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------- |
| <img src="apps/website/public/logos/langchain.png" width=35 />    | [Langchain](https://docs.palico.ai/integrations/langchain)                    | ✅        |
| <img src="apps/website/public/logos/llamaindex.png" width=35 />   | [LlamaIndex](https://docs.palico.ai/integrations/llamaindex)                  | ✅        |
| <img src="apps/website/public/logos/portkey.png" width=35 />      | [Portkey](https://docs.palico.ai/integrations/llm_providers#portkey)          | ✅        |
| <img src="apps/website/public/logos/openai.svg" width=35 />       | [OpenAI](https://docs.palico.ai/integrations/llm_providers#open-ai)           | ✅        |
| <img src="apps/website/public/logos/anthropic.png" width=35 />    | [Anthropic](https://docs.palico.ai/integrations/llm_providers#anthropic)      | ✅        |
| <img src="apps/website/public/logos/cohere.png" width=35 />       | [Cohere](https://docs.palico.ai/integrations/llm_providers)                   | ✅        |
| <img src="apps/website/public/logos/azure.png" width=35 />        | [Azure](https://docs.palico.ai/integrations/llm_providers)                    | ✅        |
| <img src="apps/website/public/logos/bedrock.png" width=35 />      | [AWS Bedrock](https://docs.palico.ai/integrations/llm_providers#aws-bedrock)  | ✅        |
| <img src="apps/website/public/logos/google_cloud.png" width=35 /> | [GCP Vertex](https://docs.palico.ai/integrations/llm_providers#gcp-vertex-ai) | ✅        |
| <img src="apps/website/public/logos/pinecone.png" width=35 />     | [Pinecone](https://docs.palico.ai/integrations/vector_db)                     | ✅        |
| <img src="apps/website/public/logos/postgres.png" width=35 />     | [PG Vector](https://docs.palico.ai/integrations/vector_db)                    | ✅        |
| <img src="apps/website/public/logos/chroma.png" width=35 />       | [Chroma](https://docs.palico.ai/integrations/vector_db)                       | ✅        |

Learn more from [docs](https://docs.palico.ai/guides/build).

### Locally test your changes in Playground UI

Make a code change and instantly preview it locally on our playground UI

![CleanShot 2024-11-12 at 21 37 50](https://github.com/user-attachments/assets/c7fc3321-12c9-49a5-973c-4ad7d6d73b57)


## 🔄 Improve Performance with Experiments

Palico helps you create an iterative loop to systematically improve the performance of your application.

<div align="center">
  
![LandPageAssets-Page-2 drawio](https://github.com/user-attachments/assets/43e26dd9-8b33-4675-8dec-a0d14df8c4cc)

</div>

### Create Test-Cases
Define test-cases that models the expected behavior of your application
```typescript
const testCases: TestDatasetFN = async () => {
  return [
    {
      input: { // input to your LLM Application
        userMessage: "What is the capital of France?",
      },
      tags: { // tags to help you categorize your test-cases
        intent: "question",
      },
      metrics: [
        // example metrics
        containsEvalMetric({
          substring: "Paris",
        }),
        levensteinEvalMetric({
          expected: "Paris",
        }),
        rougeSkipBigramSimilarityEvalMetric({
          expected: "Paris",
        }),
      ],
    },
  ];
};
```
### Run Evaluations

![CleanShot 2024-11-12 at 20 57 29](https://github.com/user-attachments/assets/526fb5cf-4548-4b0b-a62f-115e05410ba9)


### Analyze Results

![385547731-bed393b9-64e8-4735-8548-1d5ff52c0c01](https://github.com/user-attachments/assets/16c3e5d2-f035-41ad-98a8-9dd87ffb06e3)


Learn more about [experiments](https://docs.palico.ai/guides/experiments)

## 🚀 Going to Production

You can deploy your Palico app to any cloud provider using Docker.

### Continuous Integration

Setup CI/CD and Pull-Request preview with Coolify and Palico. Learn more about [deployment](https://docs.palico.ai/guides/deployment).

### Integrate with Client SDKs

```typescript
const response = await client.agent.chat({
  agentName: "chat",
  stream: true,
  userMessage: "What is the weather today?",
  payload: {
    location: "San Francisco",
  },
  appConfig: {
    model: "gpt-3.5-turbo",
    provider: "openai",
  },
});
```
### First-party support for React
```typescript
import { useChat } from "@palico-ai/react";

const { messages, sendMessage } = useChat({
  agentName: "assistant",
  apiURL: "/api/palico",
});
```

Learn more about [Client SDKs](https://docs.palico.ai/client-sdk/introduction)

## 🤝 Contributing

The easiest way to contribute is to pick an issue with the `good first issue` [tag](https://github.com/palico-ai/palico-ai/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 💪. Read the contribution guidelines [here](/CONTRIBUTING.md).

Bug Report? [File here](https://github.com/palico-ai/palico-ai/issues) | Feature Request? [File here](https://github.com/palico-ai/palico-ai/issues)

## ✨ Contributors

<a href="https://github.com/palico-ai/palico-ai/graphs/contributors">
  <img alt="contributors" src="https://contrib.rocks/image?repo=palico-ai/palico-ai"/>
</a>

<p align="right" style="font-size: 14px; color: #555; margin-top: 20px;">
    <a href="#readme-top" style="text-decoration: none; color: #007bff; font-weight: bold;">
        ↑ Back to Top ↑
    </a>
</p>
