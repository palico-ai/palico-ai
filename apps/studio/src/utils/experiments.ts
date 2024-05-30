import { ExperimentTest } from "@palico-ai/common";
import { ColumnDef } from "@tanstack/react-table";
import { DataframeDataset } from "../app/proto/analysis/analysis.context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flattenExperimentColumns = (result: ExperimentTest['result']): ColumnDef<any>[] => {
  const allTags = new Set<string>();
  const allMetrics = new Set<string>();
  result.forEach((test) => {
    Object.keys(test.tags).forEach((tag) => allTags.add(tag));
    Object.keys(test.metrics).forEach((metric) => allMetrics.add(metric));
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staticColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'input.userMessage',
      header: 'User Message',
      // TODO: Add sub row for payload
    },
    {
      accessorKey: 'output.message',
      header: 'Agent Response',
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tagColumns: ColumnDef<any>[] = Array.from(allTags).map((tag) => ({
    accessorKey: `tags.${tag}`,
    header: `Tag: ${tag}`,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metricColumns: ColumnDef<any>[] = Array.from(allMetrics).map(
    (metric) => ({
      accessorKey: `metrics.${metric}`,
      header: `Metric: ${metric}`,
    })
  );
  return staticColumns.concat(tagColumns).concat(metricColumns);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getColumnsForFlattenData = (data: Record<string, unknown>[]) => {
  const columnNames = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => columnNames.add(key));
  });
  const columnDefs: ColumnDef<unknown, unknown>[] = Array.from(columnNames).map((key) => ({
    accessorKey: key,
    header: key,
  }));
  return {
    columnNames,
    columnDefs,
  }
}

export const flattenTestResult = (result: DataframeDataset[]) => {
  const allTagNames = new Set<string>()
  const allMetricNames = new Set<string>()
  result.forEach(item => {
      Object.keys(item.tags).forEach(tag => allTagNames.add(tag))
      Object.keys(item.metrics).forEach(metric => allMetricNames.add(metric))
  })
  return result.map(result => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultEntry : Record<string, any> = {}
      resultEntry["test"] = `${result.experimentName}:${result.testName}`
      resultEntry["input_userMessage"] = result.input.userMessage ?? ""
      resultEntry["input_payload"] = result.input.payload ?? ""
      resultEntry["output_message"] = result.output.message ?? ""
      resultEntry["output_data"] = result.output.data ?? ""
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resultEntry["output_conversationId"] = (result.output as any).conversationId ?? ""
      allTagNames.forEach(tag => {
          resultEntry[`tags_${tag}`] = result.tags[tag] ?? ""
      })
      allMetricNames.forEach(metric => {
          resultEntry[`metrics_${metric}`] = result.metrics[metric] ?? ""
      })
      return resultEntry
  })
}