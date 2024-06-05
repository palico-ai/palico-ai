import * as express from 'express';
import { getAgentMetadataHandler, getAllTestCaseDatasets, getAllWorkflowsMetadataHandler, getAllTestsHandler } from './handlers';

const router = express.Router();

router.route('/agents').get(getAgentMetadataHandler);

router.route('/workflows').get(getAllWorkflowsMetadataHandler);

router.route('/test-case-dataset').get(getAllTestCaseDatasets);

router.route('/tests').get(getAllTestsHandler);


export default router;
