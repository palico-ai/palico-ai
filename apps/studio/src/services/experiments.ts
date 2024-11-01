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
import { palicoFetchJSON } from './palico';
import { RequireExperimentName, RequireNoteobokName } from '../types/common';

export const getExperimentList = async (): Promise<ExperimentMetadata[]> => {
  const data = await palicoFetchJSON<GetAllExperimentsAPIResponse>(
    '/dev/experiments',
    {
      method: 'GET',
    }
  );
  return data.experiments;
};

export const createExperiment = async (params: NewExperimentAPIRequestBody) => {
  return await palicoFetchJSON<
    NewExperimentAPIResponse,
    NewExperimentAPIRequestBody
  >('/dev/experiments', {
    method: 'POST',
    body: params,
  });
};

export const deleteExperiment = async (name: string) => {
  return await palicoFetchJSON(`/dev/experiments/${name}`, {
    method: 'DELETE',
  });
};

export const getEvalsForExperiments = async (expName: string) => {
  const data = await palicoFetchJSON<GetAllEvalsAPIResponse>(
    `/dev/experiments/${expName}/evals`,
    {
      method: 'GET',
    }
  );
  return data.evals;
};

export const getExperimentByName = async (expName: string) => {
  return await palicoFetchJSON<GetExperimentByNameAPIResponse>(
    `/dev/experiments/${expName}`,
    {
      method: 'GET',
    }
  );
};

export const runEval = async (params: CreateEvaluationParams) => {
  return await palicoFetchJSON<CreateEvalAPIResponse, CreateEvalAPIRequestBody>(
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
  return await palicoFetchJSON<Evaluation>(
    `/dev/experiments/${expName}/evals/${evalName}`,
    {
      method: 'GET',
    }
  );
};

export const getEvalStatus = async (expName: string, testName: string) => {
  return await palicoFetchJSON<GetEvalStatusAPIResponse>(
    `/dev/experiments/${expName}/evals/${testName}/status`,
    {
      method: 'GET',
    }
  );
};

export const getNotebooksForExperiment = async (expName: string) => {
  const response = await palicoFetchJSON<GetNotebooksForExperimentAPIResponse>(
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
  return await palicoFetchJSON<
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
  return await palicoFetchJSON<GetNotebookAPIResponse>(
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
  await palicoFetchJSON<CreateNotebookAPIResponse>(
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
  return await palicoFetchJSON(
    `/dev/experiments/${params.experimentName}/notebook/${params.notebookName}`,
    {
      method: 'DELETE',
    }
  );
};
