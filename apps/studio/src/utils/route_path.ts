import {
  RequireExperimentName,
  RequireLabId,
  RequireEvalName,
  RequireTestReportName,
  RequireNoteobokName,
} from '../types/common';

export class RoutePath {
  static chat() {
    return '/chat';
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

  static tracing() {
    return '/tracing';
  }

  static evaluation() {
    return '/evaluation';
  }

  static settings() {
    return '/settings';
  }
}
