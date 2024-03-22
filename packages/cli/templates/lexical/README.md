# Agent API for Lexical AI

## Description
This repository contains the LLM Agent and API for the Lexical Editor. Define your prompt logic, your LLM model, and any agent related logic here

## Quick Start
1. Install dependencies: `npm install`
2. Populate `.env` file with the following:
    ```
    OPENAI_API_KEY="<your-openai-api-key>"
    OPENAI_MODEL="gpt-3.5-turbo-1106"
    API_PORT=8000
    ```
3. Start the server: `npm start`

## Important Files
- `src/index.ts`: Defines your LLM model and how to handle building prompts for your model
- `src/prompt/index.ts`: Main prompt logic for your model. There's a system prompt and a user prompt
- `src/prompt/action_prompts.ts`: Your lexical editor will contain various actions that you define, for example "Summarize". You will define the logic for each of those actions here
- `src/prompt/editor_component.ts`: Lexical has various nodes, such as paragraph, headers, list. You will define the schema for any node you want your model to be able to generate.
- `src/prompt/rules.ts`: Define any system level rules you want ur model to follow here