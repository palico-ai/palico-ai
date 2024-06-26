---
sidebar_position: 1
---

# Installation

## Requirements

- [Docker](https://hub.docker.com/)
- [NodeJS](https://nodejs.org/en)

## Automatic setup with Palico CLI

### Create a Palico App

Create a palico app by running the following command:

```bash
npx palico init <project-name>
```

This will create a basic Palico app with a single conversational LLM application.
This starter LLM application uses OpenAI so you will need to provide your OpenAI API key in the `.env` file.

### Add your OpenAI API Key

Add your OpenAI API key to the `.env` file in the root of your project.

```bash
OPENAI_API_KEY=<your-openai-api-key>
```

### Bootstrap your Services

Your Palico app has additional services associated with it, such as a database and tracing service. To bootstrap these services, run the following command:

```bash
npm run palico bootstrap
```

You will only need to run this command once when you first setup your code repository, or when you update the version of your `@palico-ai/app` package.

### Start your Palico App

To start your Palico app, run the following command:

```bash
npm start
```

You can modify your chat application in `src/agents/chatbot/index.ts`. You can also chat with your chatbot in the Palico Studio at http://localhost:5173/chat.

## Next Steps

### Learn about different [components](/getting_started/concepts) of a palico app

Understand the different components, such as as Agents, Tests, Experiments, and Workflows, that make up a Palico App.

### Learn core concepts through our [tutorials](../tutorials/00_intro.md)

Checkout our tutorial that goes over how to build an LLM Agent with Palico, add evaluations, run experiments, and iterate on your LLM application.
