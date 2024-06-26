import { trace } from '@opentelemetry/api';
import { RequestHandler } from 'express';
import StudioLab from '../../../quick_lab/model';
import { recordRequestErrorSpan } from '../../../utils/api';
import {
  CreateLabAPIRequestBody,
  CreateLabAPIResponse,
  DeleteLabAPIResponse,
  GetLabByIdAPIResponse,
  GetLabListAPIResponse,
  UpdateLabAPIRequestBody,
  UpdateLabAPIResponse,
} from '@palico-ai/common';
import { APIError } from '../../error';

const tracer = trace.getTracer('studio-route-handler');

interface LabRouteParams {
  id: string;
}

export const CreateNewLabRequestHandler: RequestHandler<
  unknown,
  CreateLabAPIResponse,
  CreateLabAPIRequestBody
> = async (req, res, next) => {
  return await tracer.startActiveSpan('(POST) /lab', async (requestSpan) => {
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
};

export const GetAllLabsRequestHandler: RequestHandler<
  unknown,
  GetLabListAPIResponse
> = async (_, res, next) => {
  return await tracer.startActiveSpan('(GET) /lab', async (requestSpan) => {
    try {
      const labs = await StudioLab.findAll();
      requestSpan.addEvent('Labs found', {
        count: labs.length,
      });
      return res.status(200).json({ labs });
    } catch (error) {
      recordRequestErrorSpan(error, requestSpan);
      return next(error);
    } finally {
      requestSpan.end();
    }
  });
};

export const GetLabByIdRequestHandler: RequestHandler<
  LabRouteParams,
  GetLabByIdAPIResponse
> = async (req, res, next) => {
  return await tracer.startActiveSpan('(GET) /lab/:id', async (requestSpan) => {
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
};

export const UpdateLabByIdRequestHandler: RequestHandler<
  LabRouteParams,
  UpdateLabAPIResponse,
  UpdateLabAPIRequestBody
> = async (req, res, next) => {
  return await tracer.startActiveSpan(
    '(PATCH) /lab/:id',
    async (requestSpan) => {
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
    }
  );
};

export const DeleteLabByIdRequestHandler: RequestHandler<
  LabRouteParams,
  DeleteLabAPIResponse
> = async (req, res, next) => {
  return await tracer.startActiveSpan(
    '(DELETE) /lab/:id',
    async (requestSpan) => {
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
    }
  );
};
