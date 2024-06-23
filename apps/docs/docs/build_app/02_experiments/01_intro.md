# Overview

It's hard to find the right combination of inputs your LLM model needs (ex. prompt, context, LLM model, etc.) to get the desired output across different use-cases your LLM applications needs to support. The only way to find the right combination is through systematic experimentation where you test your LLM applications with different configurations to see which one works best across all your use-cases.

## Components of an Experiment

### Test Case
A test case contains the input (`userMessage` and `payload`) to an LLM Agent or workflow, a list of tags to help you group and filter the test item, and a list of metrics you want to measure for this test case. Here's an example
```typescript
{
  input: {
    userMessage: "Hello",
    payload: {/* ... */},
  },
  tags: {
    intent: "greeting",
  },
  metrics: [
    new ContainsAnyMetrics({
      substrings: ["Hello", "Hi", "Hey", "Greetings"],
    }),
  ],
}
```

### Metric
A metric is a measurement of the output of your LLM Agent's response. There are two categories of metrics:
- **Objective Metrics**: These are metrics that can be measured objectively. For example, did the response contain a specific keyword, is the response in the correct JSON format, etc.
- **Subjective Metrics**: These are metrics that require human judgment. For example, is the response coherent, is the response friendly, etc. These metrics are often measured using other LLMS or humans.

### Test Suite
A list of test cases that you want to group together. When you run an experiment, you run an evaluation, you run it against a test suite.

### Evaluation
An evaluation is a run of your LLM Agent or workflow against a test suite and a set of feature flags. The output of an evaluation is a evaluated test suite with metrics calculated for each test case.

### Experiment
You run an experiment to test something specific about your LLM Agent or workflow, for example, "How does using OpenAI vs Gemini affect the accuracy of my LLM Agent?" An experiment has a name, a hypothesis, and a list of evaluations you run to test your hypothesis.

## Running an Experiment
### Step 1: Create a Test Suite
To create a test suite, create a folder in the `test_suites` directory and add a `index.ts` file in it.

### Step 2: Create an Experiment

### Step 3: Run an Evaluation

### Step 4: Analyze the Results

## Next Steps