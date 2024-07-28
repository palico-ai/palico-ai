export interface ComponentWithChildren {
  children: React.ReactNode;
}

export interface LabItemChildPage {
  params: {
    labId: string;
  };
}

export interface ExperimentItemChildPage {
  params: {
    expName: string;
  };
}

export interface EvalChildPage {
  params: {
    expName: string;
    evalName: string;
  };
}

export interface NotebookChildPage {
  params: {
    expName: string;
    notebookName: string;
  };
}
