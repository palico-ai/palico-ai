<div align="center">

# Palico AI - LLM Tech Stack for Rapid Iteration
[![Docs](https://img.shields.io/badge/docs-palico?style=flat&label=palico)](https://docs.palico.ai/)
[![Website](https://img.shields.io/badge/website-palico?style=flat&label=palico)](https://www.palico.ai/)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/PalicoAI)](https://x.com/PalicoAI)
[![NPM Version](https://img.shields.io/npm/v/@palico-ai/app)](https://www.npmjs.com/package/@palico-ai/app)
[![GitHub License](https://img.shields.io/github/license/palico-ai/palico-ai)](https://github.com/palico-ai/palico-ai/blob/main/LICENSE)
<br>
</div

Building an LLM application involves continously trying out different ideas (models, prompts, architectures). Palico provides you with an integrated tech stack that helps you quickly iterate on your LLM development.

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

### Build your application with complete flexiblity
With Palico, you have complete control over the implementation details of your LLM application. Building an LLM application with Palico just involves implementing the `Agent` interface. Here's an example:
```typescript
import {
  Agent,
  AgentResponse,
  ConversationContext,
  ConversationRequestContent,
} from "@palico-ai/app";

class MyLLMApp implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<AgentResponse> {
    // Your LLM application logic
    // 1. Pre-processing
    // 2. Build your prompt
    // 3. Call your LLM model
    // 4. Post-processing
    return {
      // 5. Return a response to caller
    }
  }
}
```
Learn more about building your application with palico ([docs](https://docs.palico.ai/guides/build)).

### Integrates with your favorite tools and libraries

Since you own the implementation details, you can use Palico with most other external tools and libraries

|                                                                  | Tools or Libraries                                                            | Supported |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------- |
| <img src="apps/website/public/logos/langchain.png" width=35 />   | [Langchain](https://docs.palico.ai/integrations/langchain)                    | ✅         |
| <img src="apps/website/public/logos/llamaindex.png" width=35 />  | [LlamaIndex](https://docs.palico.ai/integrations/llamaindex)                  | ✅         |
| <img src="apps/website/public/logos/portkey.png" width=35 />     | [Portkey](https://docs.palico.ai/integrations/llm_providers#portkey)          | ✅         |
| <img src="apps/website/public/logos/openai.svg" width=35 />      | [OpenAI](https://docs.palico.ai/integrations/llm_providers#open-ai)           | ✅         |
| <img src="apps/website/public/logos/anthropic.png" width=35 />   | [Anthropic](https://docs.palico.ai/integrations/llm_providers#anthropic)      | ✅         |
| <img src="apps/website/public/logos/cohere.png" width=35 />      | [Cohere](https://docs.palico.ai/integrations/llm_providers)                   | ✅         |
| <img src="apps/website/public/logos/azure.png" width=35 />       | [Azure](https://docs.palico.ai/integrations/llm_providers)                    | ✅         |
| <img src="apps/website/public/logos/bedrock.png" width=35 />     | [AWS Bedrock](https://docs.palico.ai/integrations/llm_providers#aws-bedrock)  | ✅         |
| <img src="apps/website/public/logos/google_cloud.png" width=35 />| [GCP Vertex](https://docs.palico.ai/integrations/llm_providers#gcp-vertex-ai) | ✅         |
| <img src="apps/website/public/logos/pinecone.png" width=35 />    | [Pinecone](https://docs.palico.ai/integrations/vector_db)                     | ✅         |
| <img src="apps/website/public/logos/postgres.png" width=35 />    | [PG Vector](https://docs.palico.ai/integrations/vector_db)                    | ✅         |
| <img src="apps/website/public/logos/chroma.png" width=35 />      | [Chroma](https://docs.palico.ai/integrations/vector_db)                       | ✅         |

Learn more from [docs](https://docs.palico.ai/guides/build).


### Instantly preview your changes
Make a code change and instantly preview it locally on our playground UI

https://github.com/user-attachments/assets/c33ae53d-acf5-4c89-9c41-743ea1cb4722


### Easily swap models, prompts, anything and everything
Build an interchangable application layer where you can swap out any components at runtime without changing any code

##  🔄 Improving Performance
Palico helps you create an iterative loop to systematically improve performance of your LLM application


## 🚀 Going to Production

## Contributing

The easiest way to contribute is to pick an issue with the `good first issue` tag 💪. 

Bug Report? [File here](https://github.com/palico-ai/palico-ai/issues) | Feature Request? [File here](https://github.com/palico-ai/palico-ai/issues)
