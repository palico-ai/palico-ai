import { type RequestHandler } from 'express'
import { type Application } from '../../app'

export type APIRequestHandler = (app: Application) => RequestHandler
