import { Router } from 'express';
import {
  createNewExperimentHandler,
  createTestForExperimentHandler,
  getAllExperimentsHandler,
  getAllTestForExperimentHandler,
  getExperimentByNameHandler,
  getJobStatusHandler,
  getTestStatusHandler,
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

router.route('/experiments/:expName').get(getExperimentByNameHandler);

router
  .route('/experiments/:expName/tests')
  .get(getAllTestForExperimentHandler)
  .post(createTestForExperimentHandler);

router
  .route('/experiments/:expName/tests/:testName/status')
  .get(getTestStatusHandler);

export default router;
