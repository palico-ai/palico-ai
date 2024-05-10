import { Router } from 'express';
import { trace } from '@opentelemetry/api';
import { StudioLab } from '../../tables/studio_lab';
import { recordRequestErrorSpan } from '../utils';
import { APIError } from '../../errors';

const tracer = trace.getTracer('studio-router');

const router = Router();

router
  .route('/lab')
  .post(async (req, res, next) => {
    tracer.startActiveSpan('(POST) /lab', async (requestSpan) => {
      requestSpan.setAttribute('body', JSON.stringify(req.body, null, 2));
      try {
        const lab = await StudioLab.create(req.body);
        requestSpan.addEvent('Lab created', {
          id: lab.id,
          name: lab.name,
        });
        requestSpan.end();
        return res.status(200).json(lab);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      }
    });
  })
  .get(async (_, res, next) => {
    tracer.startActiveSpan('(GET) /lab', async (requestSpan) => {
      try {
        const labs = await StudioLab.findAll();
        requestSpan.addEvent('Labs found', {
          count: labs.length,
        });
        requestSpan.end();
        return res.status(200).json(labs);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      }
    });
  });

router
  .route('/lab/:id')
  .get(async (req, res, next) => {
    tracer.startActiveSpan('(GET) /lab/:id', async (requestSpan) => {
      requestSpan.setAttribute('id', req.params.id);
      try {
        const lab = await StudioLab.get(req.params.id);
        if (!lab) {
          throw APIError.notFound(`Lab with id ${req.params.id} not found`);
        }
        requestSpan.addEvent('Lab found', {
          id: lab.id,
          name: lab.name,
        });
        requestSpan.end();
        return res.status(200).json(lab);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      }
    });
  })
  .patch(async (req, res, next) => {
    tracer.startActiveSpan('(PATCH) /lab/:id', async (requestSpan) => {
      requestSpan.setAttribute('id', req.params.id);
      requestSpan.setAttribute('body', JSON.stringify(req.body, null, 2));
      try {
        await StudioLab.update(req.params.id, req.body);
        requestSpan.addEvent('Lab updated', {
          id: req.params.id,
        });
        requestSpan.end();
        return res.status(200).json({ message: 'Lab updated successfully' });
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      }
    });
  })
  .delete(async (req, res, next) => {
    tracer.startActiveSpan('(DELETE) /lab/:id', async (requestSpan) => {
      requestSpan.setAttribute('id', req.params.id);
      try {
        await StudioLab.remove(req.params.id);
        requestSpan.addEvent('Lab removed', {
          id: req.params.id,
        });
        requestSpan.end();
        return res.status(200).json({ message: 'Lab removed successfully' });
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      }
    });
  });

export default router;
