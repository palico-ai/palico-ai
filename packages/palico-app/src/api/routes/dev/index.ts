import { Router } from 'express';
import {
  newExperimentRouteHandler,
  createEvalForExperimentHandler,
  getAllExperimentsRouteHandler,
  getAllEvalForExperimentHandler,
  getExperimentByNameHandler,
  getEvalByNameHandler,
  getEvalStatusHandler,
  removeExperimentHandler,
} from './handlers';

const router = Router();

router.route('/health').get(async (_, res) => {
  res.status(200).json({ message: 'OK' });
});

router
  .route('/experiments')
  .post(newExperimentRouteHandler)
  .get(getAllExperimentsRouteHandler);

router
  .route('/experiments/:expName')
  .get(getExperimentByNameHandler)
  .delete(removeExperimentHandler);

router
  .route('/experiments/:expName/evals')
  .get(getAllEvalForExperimentHandler)
  .post(createEvalForExperimentHandler);

router.route('/experiments/:expName/evals/:evalName').get(getEvalByNameHandler);

router
  .route('/experiments/:expName/evals/:evalName/status')
  .get(getEvalStatusHandler);

export default router;
