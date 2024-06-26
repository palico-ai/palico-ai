import { Router } from 'express';
import {
  CreateNewLabRequestHandler,
  DeleteLabByIdRequestHandler,
  GetAllLabsRequestHandler,
  GetLabByIdRequestHandler,
  UpdateLabByIdRequestHandler,
} from './handlers';

const router = Router();

router
  .route('/lab')
  .post(CreateNewLabRequestHandler)
  .get(GetAllLabsRequestHandler);

router
  .route('/lab/:id')
  .get(GetLabByIdRequestHandler)
  .patch(UpdateLabByIdRequestHandler)
  .delete(DeleteLabByIdRequestHandler);

export default router;
