export interface ComponentWithChildren {
  children: React.ReactNode
}

export interface LabItemChildPage {
  params: {
    labId: string
  }
}

export interface ExperimentItemChildPage {
  params: {
    expName: string
  }
}

export interface ExperimentTestChildPage {
  params: {
    expName: string,
    testName: string
  }
}