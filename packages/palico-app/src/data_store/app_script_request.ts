import {
  AppScriptRequest,
  JobQueueStatus,
  JSONAbleObject,
  PaginationParams,
} from '@palico-ai/common';
import {
  AppScriptRequestTable,
  AppScriptRequestTableSchema,
  CreateAppScriptRequestParams,
} from '../services/database/tables';

export interface LogAppScriptRequestParams
  extends Omit<CreateAppScriptRequestParams, 'inputJSON'> {
  input: JSONAbleObject;
}

export default class AppScriptRequestDataStore {
  static async logAppScriptRequest(
    params: LogAppScriptRequestParams
  ): Promise<AppScriptRequest> {
    const response = await AppScriptRequestTable.create({
      requestId: params.requestId,
      scriptName: params.scriptName,
      inputJSON: JSON.stringify(params.input),
      status: params.status,
    });
    return AppScriptRequestDataStore.parseDataValue(response.dataValues);
  }

  static async updateStatus(requestId: string, status: JobQueueStatus) {
    await AppScriptRequestTable.update({ status }, { where: { requestId } });
  }

  static async getStatus(requestId: string): Promise<JobQueueStatus> {
    const record = await AppScriptRequestTable.findByPk(requestId);
    if (!record) {
      throw new Error(`AppScriptRequest not found: ${requestId}`);
    }
    return record.dataValues.status;
  }

  static async getRequest(requestId: string): Promise<AppScriptRequest> {
    const record = await AppScriptRequestTable.findByPk(requestId);
    if (!record) {
      throw new Error(`AppScriptRequest not found: ${requestId}`);
    }
    return this.parseDataValue(record.dataValues);
  }

  static async getRequestRequests(
    pagination: PaginationParams
  ): Promise<AppScriptRequest[]> {
    const records = await AppScriptRequestTable.findAll({
      order: [['createdAt', 'DESC']],
      limit: pagination.limit,
      offset: pagination.offset,
    });
    return records.map((record) => this.parseDataValue(record.dataValues));
  }

  private static parseDataValue(
    data: AppScriptRequestTableSchema
  ): AppScriptRequest {
    return {
      requestId: data.requestId,
      scriptName: data.scriptName,
      input: JSON.parse(data.inputJSON),
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
