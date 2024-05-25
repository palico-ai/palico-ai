export interface RequireLabId {
  labId: string
}

export interface RequireExperimentName {
  experimentName: string
}

export class RoutePath {
  static playground() {
    return '/playground'
  }

  static labItem(params: RequireLabId) {
    return `/labs/${params.labId}`
  }

  static labList() {
    return '/labs'
  }

  static experimentList() {
    return '/experiments'
  }

  static experimentItem(params: RequireExperimentName) {
    return `${RoutePath.experimentList()}/${params.experimentName}`
  }

  static tracing() {
    return '/tracing'
  }

  static evaluation() {
    return '/evaluation'
  }

  static settings() {
    return '/settings'
  }
}