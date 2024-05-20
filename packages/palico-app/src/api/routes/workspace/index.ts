import { Router } from 'express';
import { getAllDatasetsHandler } from './handlers';

const router = Router();

router.route('/datasets').get(getAllDatasetsHandler);

export default router;
