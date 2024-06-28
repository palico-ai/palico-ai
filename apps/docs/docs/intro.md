---
sidebar_position: 1
slug: /
---

# Introduction

Improving the accuracy of your LLM application requires running hundreds of experiments to test different combination of LLM models, prompt techniques, prompt context, RAG architecture, and more. Palico streamlines this experimentation by providing an LLM Development Framework that's structures your LLM development for rapid experimentation so you can reach your accuracy targets much faster.

#### The core components of a Palico application are

- **Agents**: Encapsulation of your LLM logic (prompt + LLM model call)
- **Workflows**: Orchestrate multiple agents, business-logic, and tasks together
- **Experimentation**: Systematically test and improve the accuracy of your LLM application with data-driven decisions
- **Tracing**: Understand the runtime behavior of your LLM application
- **Deployment**: Deploy your LLM application as docker containers
- **Client SDK**: Interact with your LLM application from your other services

#### Learn more

In the following section we dig a little bit deeper into the following topics:

- [Our motivation for building this framework](#motivation)
- [The 5 Stages a typical LLM development team goes through](#the-5-stages-of-llm-development)
- [Palico vs evaluation frameworks](#how-does-palico-compare-to-evaluation-frameworks)
- [Palico vs LangChain or LlamaIndex](#how-does-palico-compare-to-libraries-like-langchain-or-llamaindex)

If you would rather jump straight into building, you can get started by following the [installation guide](./getting_started/00_installation.md).

## Motivation

The common narrative around building an LLM application is that you pass in some text prompt with a bunch of context, send it to OpenAI, and it'll respond back with exactly what you want. However, this never happens in practice. Instead, the 5 stages of LLM Development a typical dev team goes through are:

### The 5 Stages of LLM Development

#### LLM is just Magic (Month 1-2)

Build all the infrastructure needed to call OpenAI or your preferred LLM model, integrate it into your backend, construct the frontend components (chatbot, co-pilot, etc.), manage user authorization, security, and everything else that comes with building a traditional application. There is often little to no thought given to the prompt or the accuracy, with the expectation that the LLM model will just work.

#### Improve Accuracy through Vibe Checks (Month 2-4)

The team realizes that the LLM application does not work as expected. The responses are not accurate, making the feature unusable for the end-user. The team tries to improve its accuracy by tweaking the prompt, adding more context, trying different LLM models, and more. They realize they doesn't have an objective way to measure accuracy, so they just rely on vibe checks. Teams may find some success, but what often happens is that relying on vibe checks may improve accuracy in one area, but decrease it in another.

#### Vibe-Check at Scale (Month 4-6)

The team realizes they need to establish ground truth — a baseline of acceptable answers to compare the results of their experiments against. They define what that looks like by creating a list of 100-1000 test cases and having the most reliable individual team member or panel evaluate the accuracy of each response. They then compare results of new test cases against their newly defined ground truth. While this new type of practice helps improve accuracy in a somewhat systematic way, it is still manual and slow.

#### Adopting an Evaluation Framework (Month 6-9)

As manually rating the accuracy of each response becomes burdensome, the team begins to seek ways to automate this "grading accuracy" process. They discover evaluation frameworks like PromptFoo, Ragas, and others that help them assess the accuracy of an LLM response. Over the next few months, they gradually replace their manual checks with these evaluation frameworks.

The team has now transitioned from viewing LLM as magic to adopting a more systematic and data-driven approach to improving the accuracy of their LLM application. However, this is only the start of their journey. They now know they need to conduct hundreds of experiments to confidently iterate towards their accuracy targets. To run the experiments, they need the ability to rapidly swap out various components of their LLM stack such as LLM models, prompt techniques, prompt context, RAG pipeline, and more. To analyze and understand the results of their experiments, they need observability tools that allow them to trace and analyze evaluation results in different granularities. Furthermore, to have confidence in the changes they are making, they need a platform that facilitates a trustable review process for relevant stake holders.

#### Rearchitecting LLM Development Tech Stack (Month 9-12)

After the 9 long months of trial and error, the team has gained a better understanding of how to best approach building LLM applications. They’ve now developed a systematic way to improve the accuracy of their LLM application. Using their learnings, they often end up rearchitecting their application to better facilitate this experimentation heavy approach, enabling them to scale their experimentation and improve the accuracy of their LLM application efficiently.

## Palico Development Framework

Palico helps you skip the 12-month journey of trial and error and jump straight to the systematic and data-driven approach to improving the accuracy of your LLM application.

Our framework structures your LLM application development for rapid experimentations. We provide an evaluation library to help you measure your application accuracy. We offer various tools to run, manage, analyze hundreds of experiments. We provide easy ways to deploy your LLM application to production, and we provide a Client SDK and REST API to help you interact with your LLM application from your other services.

We are also open-source!

### Our Goal for Development Teams

Our top 5 goals for development teams are:

1. How can we help developers streamline their experimentation process. So for example, how quickly can developer run a test comparing their LLM application using chain-of-thought prompt with gpt3.5 and X context vs gpt-4o with Few-Shot and Y context
2. What are the tools developers need to analyze an experiment in detail
3. What are the different tools developers need to collaborate with their team
4. How do we simplify the learning curve for developers working on LLM applications
5. What tools can we give developers to expand the different types of experiments they can run

## How does Palico compare to evaluation frameworks

Evaluation frameworks are often just a tool to help you grade the response of your LLM application. They may provide some proprietary observability and tracing tools. They however do not help you structure your LLM application development for rapid experimentation. They do not help you build your LLM application. They do not help you deploy your LLM application. The responsibility you have when using an evaluation framework is you need to build your own experiment management system that helps you scale your experimentation process across your team. You will have lots of fragmented tools that you need to integrate together to get a full picture of your LLM application.

We are a more integrated framework that helps you build, scale experimentation, and deploy your LLM application. We provide a more integrated experience for your team to work on LLM applications.

## How does Palico compare to libraries like LangChain or LlamaIndex

LangChain and LlamaIndex are more like libraries that helps you achieve different tasks with LLM Development. For example, they provide you tools to connect with different LLM providers, connect to vector database, create evaluations, and more. They are more like a swiss army knife that helps you achieve different tasks with LLM Development. It's up to you to use these tools to structure your LLM application development for maximum productivity.

We are a framework (not a library) that has strong opinions on how you should structure your LLM application development. Our opinion is biased towards accuracy improvement through rapid experimentations. With our framework, you have a standard process for how you build your LLM application, measure accuracy, and run experiments. These processes all work together to maximize experiment-ability of your LLM application so you can reach your accuracy goals faster.

As we are a framework and LangChain or LlamaIndex are libraries, you can directly use LangChain or LlamaIndex within our application to help with tasks such as calling LLM models or managing your RAG layer. Our framework will help you streamline your experimentation process.
