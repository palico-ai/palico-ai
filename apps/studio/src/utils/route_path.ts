import {
  RequireExperimentName,
  RequireLabId,
  RequireEvalName,
  RequireTestReportName,
  RequireNoteobokName,
  RequireWorkflowName,
} from '../types/common';

export enum QueryParam {
  requestId = 'requestId',
}

export class RoutePath {
  static login() {
    return '/login';
  }

  static chat() {
    return '/chat';
  }

  static workflowList() {
    return '/workflow';
  }

  static workflowItem(params: RequireWorkflowName) {
    return `${RoutePath.workflowList()}/${params.workflowName}`;
  }

  static labItem(params: RequireLabId) {
    return `/labs/${params.labId}`;
  }

  static labList() {
    return '/labs';
  }

  static experimentList() {
    return '/experiments';
  }

  static experimentItem(params: RequireExperimentName) {
    return `${RoutePath.experimentList()}/${params.experimentName}`;
  }

  static experimentEvalList(params: RequireExperimentName) {
    return `${RoutePath.experimentItem(params)}/evals`;
  }

  static experimentEvalItem(params: RequireExperimentName & RequireEvalName) {
    return `${RoutePath.experimentEvalList(params)}/${params.evalName}`;
  }

  static experimentNotebookList(params: RequireExperimentName) {
    return `${RoutePath.experimentItem(params)}/notebooks`;
  }

  static experimentNotebookItem(
    params: RequireExperimentName & RequireNoteobokName
  ) {
    return `${RoutePath.experimentNotebookList(params)}/${params.notebookName}`;
  }

  static experimentReportItem(params: RequireExperimentName) {
    return `${RoutePath.experimentItem(params)}/reports`;
  }

  static experimentNewReportItem(params: RequireExperimentName) {
    return `${RoutePath.experimentReportItem(params)}/new`;
  }

  static experimentEvalReportItem(
    params: RequireExperimentName & RequireTestReportName
  ) {
    return `${RoutePath.experimentEvalList(params)}/${params.testReportName}`;
  }

  static requestTraceList() {
    return '/telemetry/requests';
  }

  static requestTraceItem(params: { requestId: string }) {
    return `${RoutePath.requestTraceList()}?${QueryParam.requestId}=${
      params.requestId
    }`;
  }

  static evaluation() {
    return '/evaluation';
  }

  static settings() {
    return '/settings';
  }
}
