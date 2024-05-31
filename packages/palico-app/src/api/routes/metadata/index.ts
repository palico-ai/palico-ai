import * as express from 'express';
import { getAgentMetadataHandler, getDatasetMetadataHandler, getAllWorkflowsMetadataHandler, getAllTestsHandler } from './handlers';

const router = express.Router();

router.route('/agents').get(getAgentMetadataHandler);

router.route('/workflows').get(getAllWorkflowsMetadataHandler);

router.route('/datasets').get(getDatasetMetadataHandler);

router.route('/tests').get(getAllTestsHandler);


export default router;
