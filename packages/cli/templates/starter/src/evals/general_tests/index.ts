import {
  containsAllEvalMetric,
  levensteinEvalMetric,
  rougeLCSSimilarityEvalMetric,
  rougeNGramSimilarityEvalMetric,
  rougeSkipBigramSimilarityEvalMetric,
  testFromDataset,
} from "@palico-ai/app";
import dataset from "./dataset.json";

export default testFromDataset({
  fetchDataset: async () => {
    // get dataset from json file or any other source
    return dataset;
  },
  testCase: (item) => {
    // return a test case for each item in the dataset
    return {
      input: {
        // input to your agent
        userMessage: item.userMessage,
      },
      tags: {
        // tags to help categorize the test case
        intent: item.tags.intent,
      },
      metrics: [
        // different metrics to evaluate the response
        containsAllEvalMetric({
          substrings: item.evals.containsAny,
        }),
        levensteinEvalMetric({
          expected: item.evals.similarityReference,
        }),
        rougeSkipBigramSimilarityEvalMetric({
          expected: item.evals.similarityReference,
        }),
        rougeLCSSimilarityEvalMetric({
          expected: item.evals.similarityReference,
        }),
        rougeNGramSimilarityEvalMetric({
          expected: item.evals.similarityReference,
        }),
      ],
    };
  },
});
