<a name="readme-top"></a>

<div align="center">

# Palico AI - LLM Tech Stack for Rapid Iteration

[![Docs](https://img.shields.io/badge/docs-palico?style=flat&label=palico)](https://docs.palico.ai/)
[![Website](https://img.shields.io/badge/website-palico?style=flat&label=palico)](https://www.palico.ai/)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/PalicoAI)](https://x.com/PalicoAI)
[![NPM Downloads](https://img.shields.io/npm/d18m/%40palico-ai%2Fapp)](https://www.npmjs.com/package/@palico-ai/app)
[![NPM Version](https://img.shields.io/npm/v/@palico-ai/app)](https://www.npmjs.com/package/@palico-ai/app)
<br>

</div

Building an LLM application involves continuously trying out different ideas (models, prompts, architectures). Palico gives you the tech stack that helps you quickly iterate on your LLM development.

#### With Palico you can

- ✅&nbsp; **Build** any application in code with complete flexibility ([docs](https://docs.palico.ai/guides/build))
- ✅&nbsp; **Integrate** with any external libraries like LangChain, LlamaIndex, Portkey, and more ([docs](https://docs.palico.ai/integrations/langchain)) <br>
- ✅&nbsp; **Preview changes** instantly with Playground UI ([docs](https://docs.palico.ai/guides/preview_changes)) <br>
- ✅&nbsp; **Improve performance** with Evaluations ([docs](https://docs.palico.ai/guides/experiments)) <br>
- ✅&nbsp; Debug issues with comprehensive **logs and tracs** ([docs](https://docs.palico.ai/guides/telemetry)) <br>
- ✅&nbsp; Deploy your application behind a **REST API** ([docs](https://docs.palico.ai/guides/client_sdk)) <br>
- ✅&nbsp; Manage your application from a **control panel** ([docs](https://docs.palico.ai/components#palico-studio)) <br>

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

https://github.com/user-attachments/assets/bfee992b-56d9-41a0-90b2-43269575ea2a

## 🛠️ Building your Application

### Build your application with complete flexibility

With Palico, you have complete control over the implementation details of your LLM application. Build any application by creating a `Chat` function. Here's an example:

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

### Instantly preview your changes

Make a code change and instantly preview it locally on our playground UI

https://github.com/user-attachments/assets/c33ae53d-acf5-4c89-9c41-743ea1cb4722

### Easily swap models, prompts, anything and everything

Working on LLM application involves testing different variations of models, prompts, and application logic. Palico helps you build an interchangeable application layer using "feature-flag-like" feature called AppConfig. Using AppConfig, you can easily swap models, prompts, or any logic in your application layer.

Learn more about [AppConfig](https://docs.palico.ai/guides/feature_flag).

## 🔄 Improving Performance with Experiments

Palico helps you create an iterative loop to systematically improve performance of your LLM application using experiments.

<div align="center">
  
![LandPageAssets-Page-2 drawio](https://github.com/user-attachments/assets/43e26dd9-8b33-4675-8dec-a0d14df8c4cc)

</div>

With experiments, you can:

1. Setup a list of test-cases that models the behavior of your application
2. Make a change to your application
3. Run an evaluation to measure how well your application performed against your test-cases
4. Iterate

Learn more about [experiments](https://docs.palico.ai/guides/experiments)

## 🚀 Going to Production

You can deploy your Palico app to any cloud provider using Docker or use our managed hosting (coming soon). You can then use our ClientSDK or REST API to communicate with your LLM application.

Learn more from [docs](https://docs.palico.ai/guides/client_sdk).

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
