### Create a Palico App

Create a palico app by running the following command:

```bash
npx palico init <project-name>
```

This will create a basic Palico app with a single conversational LLM application.
This starter LLM application uses OpenAI so you will need to provide your OpenAI API key in the `.env` file.

### Add your OpenAI API Key

Add your OpenAI API key to the `.env` file in the root of your project. You can get your OpenAI API key from https://platform.openai.com/api-keys.

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
