import * as express from 'express';
import {
  getAgentMetadataHandler,
  getAllTestCaseDatasets,
  getAllWorkflowsMetadataHandler,
  getAllTestsHandler,
} from './handlers';

const router = express.Router();

// TODO: Move these routes to the appropriate files

router.route('/agents').get(getAgentMetadataHandler);

router.route('/workflows').get(getAllWorkflowsMetadataHandler);

router.route('/test-case-dataset').get(getAllTestCaseDatasets);

router.route('/tests').get(getAllTestsHandler);

export default router;
