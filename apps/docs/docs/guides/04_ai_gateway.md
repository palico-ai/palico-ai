# Setup an AI Gateway

AI Gateway is a service that let's you use with different LLM models from a single endpoint. We can use AI Gateway along with App Config to easily test different LLM models with our LLM application. Some notable AI Gateway are:
- [Portkey](../integrations/llm_providers/portkey.md)
- [GCP Vertex](../integrations/llm_providers/gcp_vertex.md)
- [AWS Bedrock](../integrations/llm_providers/aws_bedrock.md)

For this guide, we'll use Portkey as our AI Gateway.

## Setup Portkey

### Local Setup
You can setup Portkey [locally](https://github.com/Portkey-AI/gateway), or use the hosted version at [https://portkey.ai](https://portkey.ai). Once you have Portkey setup, continue with the following steps.

### Add Portkey to your project

```bash
npm install portkey
```

## Using Portkey to call OpenAI models
```typescript
import { Portkey } from 'portkey';

class ChatbotAgent implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<LLMAgentResponse> {
    const { userMessage } = content;
    // Create Portkey client
    const portkey = new Portkey({
      Authorization: "Bearer sk-xxxxx",
      provider: "openai",
    });
    // Call the API
    const response = await portkey.chat.completions.create({
      messages: [{ role: 'user', content: userMessage }],
      model: 'gpt-3.5-turbo',
    });
    return {
      message: response.choices[0].message.content,
    };
  }
}
```

## Using Portkey to call any LLM model with App Config
To be able to easily swap different LLM models in your application, you can use [AppConfig](./03_feature_flag.md) along with Portkey. This will allow you to use any LLM model without changing your code and just updating the AppConfig.

```typescript
import { Portkey } from 'portkey';

interface AppConfig {
  model: string;
  provider: string;
}

class ChatbotAgent implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext<AppConfig>
  ): Promise<LLMAgentResponse> {
    const { userMessage } = content;
    const { model, provider } = context.appConfig;
    // highlight-start
    const portkey = new Portkey({
      Authorization: "Bearer sk-xxxxx",
      provider: provider,
      // ...additional authorization params
    });
    const response = await portkey.chat.completions.create({
      messages: [{ role: 'user', content: userMessage }],
      model: model,
    });
    // highlight-end
    return {
      message: response.choices[0].message.content,
    };
  }
}
```

Using AppConfig to swap LLM models allows you to easily run experiments with different variations of your applications locally, or run A/B tests in production without changing your code.

## Next Steps
- [Learn about Experimentation with AppConfig](./07_experiments.md)
- [Setup a Prompt Management System](./05_prompt_manage.md)
- [Portkey Documentation](https://docs.portkey.ai/docs)