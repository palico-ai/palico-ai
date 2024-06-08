import {
  ExactMatchEvalMetric,
  ExperimentTestCaseDataset,
  ProfessionalismEvalMetric,
} from "@palico-ai/app";
import { Contains, FactualityMetrics, MemoryMetrics } from "../metrics";

export const testName = (name: string) => ({
  category: "name",
  value: name,
});

export interface AddTestCaseParams {
  message: string;
  greeting?: boolean;
  math?: boolean;
  exactMatch?: string;
  professionalism?: boolean;
  contains?: string;
  factuality?: string;
}

export const testCase = (
  params: AddTestCaseParams
): ExperimentTestCaseDataset => {
  const tags: Record<string, string> = {};
  if (params.greeting) {
    tags["intent"] = "greeting";
  }
  if (params.math) {
    tags["intent"] = "math";
  }

  const metrics = [];
  if (params.exactMatch) {
    metrics.push(
      new ExactMatchEvalMetric({ expected: { message: params.exactMatch } })
    );
  }
  if (params.professionalism) {
    metrics.push(new ProfessionalismEvalMetric());
  }
  if (params.factuality) {
    metrics.push(new FactualityMetrics({ fact: params.factuality }));
  }
  if (params.contains) {
    metrics.push(new Contains("Asif"));
  }

  return {
    input: {
      userMessage: params.message,
    },
    tags,
    metrics,
  };
};
