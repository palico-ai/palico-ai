export interface RequireLabId {
  labId: string;
}

export interface RequireExperimentName {
  experimentName: string;
}

export interface RequireTestName {
  testName: string;
}

export interface RequireTestReportName {
  testReportName: string;
}

export class RoutePath {
  static playground() {
    return '/playground';
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

  static experimentTestList(params: RequireExperimentName) {
    return `${RoutePath.experimentItem(params)}/tests`;
  }

  static experimentTestItem(params: RequireExperimentName & RequireTestName) {
    return `${RoutePath.experimentTestList(params)}/${params.testName}`;
  }

  static experimentReportItem(params: RequireExperimentName) {
    return `${RoutePath.experimentItem(params)}/reports`;
  }

  static experimentNewReportItem(params: RequireExperimentName) {
    return `${RoutePath.experimentReportItem(params)}/new`;
  }

  static experimentTestReportItem(params: RequireExperimentName & RequireTestReportName) {
    return `${RoutePath.experimentTestList(params)}/${params.testReportName}`;
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
