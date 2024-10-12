import {
  JSONAbleObject,
  QueueJobStatus,
  WorkflowExecution,
} from '@palico-ai/common';
import {
  WorkflowExecutionTable,
  WorkflowExecutionTableSchema,
} from '../services/database/tables';

export type CreateWorkflowExecutionEntry = Omit<
  WorkflowExecution,
  'createdAt' | 'updatedAt'
>;

export class WorkflowExecutionDataStore {
  static async newRequestEntry(
    entry: CreateWorkflowExecutionEntry
  ): Promise<void> {
    await WorkflowExecutionTable.create({
      ...entry,
      graphJSON: JSON.stringify(entry.graph),
      executionStackJSON: JSON.stringify(entry.executionStack),
    });
  }

  static async getRequest(requestId: string): Promise<WorkflowExecution> {
    const entry = await WorkflowExecutionTable.findByPk(requestId);
    if (!entry) {
      throw new Error(`Request with id ${requestId} not found`);
    }
    return WorkflowExecutionDataStore.parseTableData(entry.dataValues);
  }

  static async updateStatus(
    requestId: string,
    status: QueueJobStatus
  ): Promise<void> {
    await WorkflowExecutionTable.update({ status }, { where: { requestId } });
  }

  static async getStatus(requestId: string): Promise<QueueJobStatus> {
    const entry = await WorkflowExecutionTable.findByPk(requestId);
    if (!entry) {
      throw new Error(`Request with id ${requestId} not found`);
    }
    return entry.dataValues.status;
  }

  static async updateExecutionStack(
    requestId: string,
    executionStack: JSONAbleObject[]
  ): Promise<void> {
    await WorkflowExecutionTable.update(
      { executionStackJSON: JSON.stringify(executionStack) },
      { where: { requestId } }
    );
  }

  private static parseTableData(
    entry: WorkflowExecutionTableSchema
  ): WorkflowExecution {
    return {
      ...entry,
      graph: JSON.parse(entry.graphJSON),
      executionStack: JSON.parse(entry.executionStackJSON),
    };
  }
}
