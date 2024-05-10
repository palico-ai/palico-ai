export interface RequireLabId {
  labId: string
}

export class RoutePath {
  static labItem(params: RequireLabId) {
    return `/labs/${params.labId}`
  }

  static labItemList() {
    return '/labs'
  }
}