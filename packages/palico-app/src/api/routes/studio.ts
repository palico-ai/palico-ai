import { Router } from 'express';
import { trace } from '@opentelemetry/api';
import StudioLab from '../../quick_lab/model';
import { recordRequestErrorSpan } from '../../utils/api';
import { APIError } from '../error';

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
        return res.status(200).json(lab);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
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
        return res.status(200).json(labs);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
      }
    });
  });

router
  .route('/lab/:id')
  .get(async (req, res, next) => {
    tracer.startActiveSpan('(GET) /lab/:id', async (requestSpan) => {
      requestSpan.setAttribute('id', req.params.id);
      try {
        const lab = await StudioLab.getByName(req.params.id);
        if (!lab) {
          throw APIError.notFound(`Lab with id ${req.params.id} not found`);
        }
        requestSpan.addEvent('Lab found', {
          id: lab.id,
          name: lab.name,
        });
        return res.status(200).json(lab);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
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
        return res.status(200).json({ message: 'Lab updated successfully' });
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
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
        return res.status(200).json({ message: 'Lab removed successfully' });
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
      }
    });
  });

export default router;
