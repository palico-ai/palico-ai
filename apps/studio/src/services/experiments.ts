'use server';

import {
  CreateEvaluationParams,
  ExperimentMetadata,
  Evaluation,
  CreateEvalAPIRequestBody,
  CreateEvalAPIResponse,
  NewExperimentAPIResponse,
  NewExperimentAPIRequestBody,
  GetAllExperimentsAPIResponse,
  GetExperimentByNameAPIResponse,
  GetAllEvalsAPIResponse,
  GetEvalStatusAPIResponse,
  GetNotebooksForExperimentAPIResponse,
  CreateNotebookAPIResponse,
  CreateNotebookAPIRequestBody,
  GetNotebookAPIResponse,
  UpdateNotebookAPIRequestBody,
} from '@palico-ai/common';
import { palicoFetch } from './palico';
import { RequireExperimentName, RequireNoteobokName } from '../types/common';

export const getExperimentList = async (): Promise<ExperimentMetadata[]> => {
  const data = await palicoFetch<GetAllExperimentsAPIResponse>(
    '/dev/experiments',
    {
      method: 'GET',
    }
  );
  return data.experiments;
};

export const createExperiment = async (params: NewExperimentAPIRequestBody) => {
  return await palicoFetch<
    NewExperimentAPIResponse,
    NewExperimentAPIRequestBody
  >('/dev/experiments', {
    method: 'POST',
    body: params,
  });
};

export const deleteExperiment = async (name: string) => {
  return await palicoFetch(`/dev/experiments/${name}`, {
    method: 'DELETE',
  });
};

export const getEvalsForExperiments = async (expName: string) => {
  const data = await palicoFetch<GetAllEvalsAPIResponse>(
    `/dev/experiments/${expName}/evals`,
    {
      method: 'GET',
    }
  );
  return data.evals;
};

export const getExperimentByName = async (expName: string) => {
  return await palicoFetch<GetExperimentByNameAPIResponse>(
    `/dev/experiments/${expName}`,
    {
      method: 'GET',
    }
  );
};

export const runEval = async (params: CreateEvaluationParams) => {
  return await palicoFetch<CreateEvalAPIResponse, CreateEvalAPIRequestBody>(
    `/dev/experiments/${params.experimentName}/evals`,
    {
      method: 'POST',
      body: {
        evalName: params.evalName,
        description: params.description,
        appConfig: params.appConfig,
        agentName: params.agentName,
        workflowName: params.workflowName,
        testSuiteName: params.testSuiteName,
      },
    }
  );
};

export const getEvalByName = async (expName: string, evalName: string) => {
  return await palicoFetch<Evaluation>(
    `/dev/experiments/${expName}/evals/${evalName}`,
    {
      method: 'GET',
    }
  );
};

export const getEvalStatus = async (expName: string, testName: string) => {
  return await palicoFetch<GetEvalStatusAPIResponse>(
    `/dev/experiments/${expName}/evals/${testName}/status`,
    {
      method: 'GET',
    }
  );
};

export const getNotebooksForExperiment = async (expName: string) => {
  const response = await palicoFetch<GetNotebooksForExperimentAPIResponse>(
    `/dev/experiments/${expName}/notebook`,
    {
      method: 'GET',
    }
  );
  return response.notebooks;
};

export const createNotebook = async (
  params: CreateNotebookAPIRequestBody & RequireExperimentName
) => {
  return await palicoFetch<
    CreateNotebookAPIResponse,
    CreateNotebookAPIRequestBody
  >(`/dev/experiments/${params.experimentName}/notebook`, {
    method: 'POST',
    body: {
      notebookName: params.notebookName,
      rows: params.rows,
      datasetMetadata: params.datasetMetadata,
    },
  });
};

export const getNotebook = async (
  params: RequireExperimentName & RequireNoteobokName
) => {
  return await palicoFetch<GetNotebookAPIResponse>(
    `/dev/experiments/${params.experimentName}/notebook/${params.notebookName}`,
    {
      method: 'GET',
    }
  );
};

export const updateNotebook = async (
  params: UpdateNotebookAPIRequestBody &
    RequireExperimentName &
    RequireNoteobokName
) => {
  await palicoFetch<CreateNotebookAPIResponse>(
    `/dev/experiments/${params.experimentName}/notebook/${params.notebookName}`,
    {
      method: 'PUT',
      body: {
        rows: params.rows,
        datasetMetadata: params.datasetMetadata,
      },
    }
  );
};

export const deleteNotebook = async (
  params: RequireExperimentName & RequireNoteobokName
) => {
  return await palicoFetch(
    `/dev/experiments/${params.experimentName}/notebook/${params.notebookName}`,
    {
      method: 'DELETE',
    }
  );
};
