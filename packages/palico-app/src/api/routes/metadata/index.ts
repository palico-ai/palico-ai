import * as express from 'express';
import { getAgentMetadataHandler, getDatasetMetadataHandler, getAllWorkflowsMetadataHandler } from './handlers';

const router = express.Router();

router.route('/agents').get(getAgentMetadataHandler);

router.route('/workflows').get(getAllWorkflowsMetadataHandler);

router.route('/datasets').get(getDatasetMetadataHandler);


export default router;
