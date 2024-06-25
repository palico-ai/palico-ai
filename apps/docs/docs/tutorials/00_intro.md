# Overview and Setup

## What are we building?

In this tutorial we'll first build a Math Tutor LLM Agent using Palico. We'll then attempt to improve it's accuracy by setting up evaluations and run experiments testing different prompt techniques, different LLM models, and pulling context from a RAG pipeline. Finally, we'll create a generalized LLM Agent workflow which will consist of multiple LLM Agents for different subjects such as Math, Science, and History. We'll use workflows to orchestrate these agents and run experiments to test the overall accuracy of the workflow.

#### By the end of this tutorial you will know how to

- Create an LLM Agent using Palico
- Setup tests to measure the accuracy of your LLM Agent
- Run experiments to iteratively improve the accuracy of your LLM Agent
- Create a workflow to orchestrate multiple LLM Agents

## Prerequisites

- [Docker](https://hub.docker.com/)
- [NodeJS](https://nodejs.org/en)

## Installation

### Setup with Palico CLI

Open your terminal and setup a new Palico App by running the following command:

```bash
npx palico init palico-tutorial
```
This will create a folder named `palico-tutorial` with a basic Palico app.

### Add your OpenAI API Key

We'll be using OpenAI for our LLM model, so you'll need to provide your OpenAI API key in the `.env` file.

You can get your OpenAI API key from [here](https://platform.openai.com/api-keys).
```
OPENAI_API_KEY=<your-openai-api-key>
```