import { RequestHandler } from 'express';
import DatasetModel from '../../../models/datasets';

export const getAllDatasetsHandler: RequestHandler = async (_, res, next) => {
  try {
    const datasets = await DatasetModel.getAllDatasets();
    return res.status(200).json({ datasets });
  } catch (error) {
    return next(error);
  }
}