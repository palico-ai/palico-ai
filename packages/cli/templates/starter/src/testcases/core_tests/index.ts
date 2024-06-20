import {
  ContainsAnyMetrics,
  ContainsMetrics,
  ExperimentTestCaseDataset,
  ValidJSONMetrics,
} from "@palico-ai/app";
import z from "zod";

const TestCaseDataset: ExperimentTestCaseDataset[] = [
  {
    input: {
      userMessage: "Hello",
    },
    tags: {
      intent: "greeting",
    },
    metrics: [
      new ContainsAnyMetrics({
        substrings: ["Hello", "Hi", "Hey", "Greetings"],
      }),
    ],
  },
  {
    input: {
      userMessage: "What is the capital of France?",
    },
    tags: {
      intent: "question",
    },
    metrics: [
      new ContainsMetrics({
        substring: "France",
      }),
    ],
  },
  {
    input: {
      userMessage:
        "Given the equation 2x + 3 = 7, solve for x. Only respond with the final value of x.",
    },
    tags: {
      intent: "math",
    },
    metrics: [
      new ContainsMetrics({
        substring: "2",
      }),
    ],
  },
  {
    input: {
      userMessage: `Write a poem about cats. Respond with a valid JSON object with the following schema:
      ====
      {
        "title": "Title of the poem",
        "lines": [
          "Line 1",
          "Line 2",
          "Line 3",
          ...
        ]
      }
      `,
    },
    tags: {
      intent: "history",
    },
    metrics: [
      new ValidJSONMetrics({
        responseKey: "message",
        schema: z.object({
          title: z.string(),
          lines: z.array(z.string()),
        }),
      }),
    ],
  },
];

export default TestCaseDataset;
