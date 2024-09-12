# LangChain

Palico provides complete flexibility over the implementation details of your LLM Application, and as such, you can tools like LangChain to build help build your LLM Application.

## Example Using LangChain to Call LLM Model

LangChain provides an uniform interface to communicate with lots of different LLM models. Here is an example of how to use LangChain to call an LLM model within a Palico Agent.

```typescript title="src/agents/my_agent/index.ts"
import {
  ConversationContext,
  ConversationRequestContent,
  Agent,
  AgentResponse,
} from "@palico-ai/app";
// highlight-start
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
// highlight-end

export default class ChatbotAgent implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<AgentResponse> {
    const { userMessage } = content;
    if (!userMessage) throw new Error("User message is required");
    // highlight-start
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });
    const response = await model.invoke([
      new HumanMessage({ content: userMessage }),
    ]);
    // highlight-end
    return {
      message: response.content as string,
    };
  }
}
```

## Using LangChain with Palico Effectively
LangChain provides lots of utility libraries to help you the actual implementation of your LLM Application whereas Palico provides the overall architecture. You can build powerful LLM application by combining the two. For example, you can build the core of your application with LangChain, then use Palico to [preview changes](../guides/02_preview_changes.md), run [experiments](../guides/07_experiments.md), add [tracing](../guides/06_telemetry.md), and publish your application behind a [REST API](../guides/10_client_sdk.md).

## Common Use-Cases with LangChain
### Index and Retrieve Documents for RAG Applications
When building a RAG Application, you need to first index your documents to a Vector Database, then retrieve it from that database. LangChain provides variety of tools to communicate with Vector Databases like Pinecone, PGVector, and more. Learn more from the [LangChain Documentation](https://js.langchain.com/v0.2/docs/tutorials/rag/).

### Prompt Templates
The primary input to an LLM model is the prompt, and as such, we this prompt can become complex. LangChain provides a tool to build these complex prompts using templates. Learn more from the [LangChain Documentation](https://js.langchain.com/v0.2/docs/concepts/#prompt-templates).

### Communicating with LLM Models
LangChain provides a unified interface to communicate with different LLM models. You can use LangChain to call models from OpenAI, Claude, and more. Learn more from the [LangChain Documentation](https://js.langchain.com/v0.2/docs/how_to/#llms).