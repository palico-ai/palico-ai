# Metrics

Metrics are a way to measure the output of your LLM Agent's response. You can learn more about metrics in the [experiments section](./01_intro.md#metric). Palico provides a set of metrics out-of-the-box, but you can also create your own custom metrics.

## Provided Metrics

| Metric Name        | Description                                                    | API Reference                                                                                 |
| ------------------ | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| ContainsMetrics    | Checks if the response contains the provided substring         | [ContainsMetrics](https://palico-ai.github.io/palico-main/classes/_palico_ai_app.ContainsMetrics.html)     |
| ContainsAnyMetrics | Checks if the response contains any of the provided substrings | [ContainsAnyMetrics](https://palico-ai.github.io/palico-main/classes/_palico_ai_app.ContainsAnyMetrics.html) |
| ContainsAllMetrics | Checks if the response contains all of the provided substrings | [ContainsAllMetrics](https://palico-ai.github.io/palico-main/classes/_palico_ai_app.ContainsAllMetrics.html) |
| ExactMatchMetrics  | Checks if the response is an exact match                       | [ExactMatchMetrics](https://palico-ai.github.io/palico-main/classes/_palico_ai_app.ExactMatchEvalMetric.html)   |
| ValidJSONMetrics   | Checks if the response is a valid JSON                         | [ValidJSONMetrics](https://palico-ai.github.io/palico-main/classes/_palico_ai_app.ValidJSONMetrics.html)     |

## Adding your own custom metrics

You can create your own metrics by extending the `EvalMetric` class. Here's an example of creating a custom metric that checks if the response is within a certain length:

```typescript
import { EvalMetric } from "@palico-ai/app";

export class LengthMetrics extends EvalMetric {
  constructor(private min: number, private max: number) {
    super();
  }

  async evaluate(response: string): Promise<number> {
    const length = response.length;
    if (length >= this.min && length <= this.max) {
      return 1;
    }
    return 0;
  }
}
```