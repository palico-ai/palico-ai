import { Router } from 'express';
import {
  createNewExperimentHandler,
  createTestForExperimentHandler,
  getAllExperimentsHandler,
  getAllTestForExperimentHandler,
  getJobStatusHandler,
} from './handlers';

const router = Router();

router.route('/health').get(async (_, res) => {
  res.status(200).json({ message: 'OK' });
});

router.route('/job/:jobId/status').get(getJobStatusHandler);

router
  .route('/experiments')
  .post(createNewExperimentHandler)
  .get(getAllExperimentsHandler);

router
  .route('/experiments/:expName/test')
  .get(getAllTestForExperimentHandler)
  .post(createTestForExperimentHandler);

export default router;
