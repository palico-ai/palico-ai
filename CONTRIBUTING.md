## Welcome

Thank you for considering contributing to Palico AI! We are at the very early stage of this framework and we'd love your help to make this the best AI Development Framework for developers! Whether you're reporting a bug, suggesting a feature, improving documentation, or writing code, your contributions are invaluable to us.

## Ways to Contribute

1. [Bug Reports](https://github.com/palico-ai/palico-ai/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=)
2. [Feature Requests](https://github.com/palico-ai/palico-ai/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=)
3. [Documentation](https://github.com/palico-ai/docs)
4. [Code Contributions](#code-contributions)

## Code Contributions

We encourage you to explore the existing [issues](https://github.com/palico-ai/palico-ai/issues) to see how you can make a meaningful impact. This document will help you setup your development environment.

### Workspace Setup

We want to setup the following folder structure:

```
palico-workspace/
├── palico-ai/
├── sample-app/
```

- **`palico-ai`**: This is the main repository you will make feature changes.
- **`sample-app`**: This is a sample application that uses the Palico AI framework.

#### Steps

1. Create a new folder called `palico-workspace` and navigate to it:
   ```bash
   mkdir palico-workspace
   cd palico-workspace
   ```
2. Fork this [repo](https://github.com/palico-ai/palico-ai) and clone it:
   ```bash
   git clone https://github.com/<github_username>/palico-ai
   ```
3. Setup `sample-app` for testing your changes:
   ```bash
   npx palico init sample-app
   ```
4. Setup the `palico-ai` repo
   ```bash
   cd palico-ai
   cp .template.env .env
   npm install
   ```
5. Install `nx` for managing `palico-ai` monorepo
   ```
   npm install -g nx
   ```
6. Update `sample-app/.env` with your OpenAI API key.
   ```bash
   OPENAI_API_KEY=sk-<your-api-key>
   ```

### Making Changes

Palico has various packages that you can contribute to. For making change to a specific package, follow the instructions README.md file in the package directory.

| Package Name                                  | Description                                                                        | Directory           |
| --------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------- |
| [Palico Studio](./apps/studio/README.md)      | Control Panel for your Palico Application                                          | apps/studio         |
| [Website](./apps/website/README.md)           | Landing Page (https://www.palico.ai/)                                              | apps/website        |
| [Palico App](./packages/palico-app/README.md) | Core framework used to define your LLM Application                                 | packages/palico-app |
| [Client SDK](./packages/client-js/README.md)  | SDK used by other services (eg. frontend) to communicate with your LLM Application | packages/client-js  |
| [Palico CLI](./packages/cli/README.md)        | The `npx palico` package. Primarily used to create new Palico App                  | packages/cli        |


## Pull Request

Prior to submitting a pull request. Make sure your code is properly formatted and builds successfully.

```bash
nx run sanity-check
```
