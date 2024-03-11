import { type Application } from '../app'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { defaultErrorMiddleware } from './middlewares/default_error_middeware'
import { NewConersationRequestHandler } from './request_handler/new_conversation'
import { ReplyAsUserRequestHandler } from './request_handler/reply_as_user'
import { ReplyAsToolRequestHandler } from './request_handler/reply_as_tool'
import { GetConversationById } from './request_handler/get_conversation_by_id'
import { eventContext } from 'aws-serverless-express/middleware'

export interface ExpressAPIBuilderParams {
  application: Application
  authorizer: express.RequestHandler
}

export enum Route {
  NewConversation = '/new-conversation',
  ReplyAsUser = '/:conversationId/reply-as-user',
  ReplyAsTool = '/:conversationId/reply-as-tool',
  GetConversationById = '/admin/conversation/:conversationId',
}

export class ExpressAPIBuilder {
  public readonly router: express.Router
  public readonly app: express.Application
  private readonly application: Application
  private readonly preRequestMiddlwares: express.RequestHandler[] = []
  private readonly authorizer: express.RequestHandler
  private errorHandler?: express.ErrorRequestHandler
  private readonly routeMiddlewares = new Map<Route, express.RequestHandler[]>()

  constructor (params: ExpressAPIBuilderParams) {
    this.application = params.application
    this.app = express()
    this.router = express.Router()
    this.authorizer = params.authorizer
  }

  addPreRequestMiddleware (middleware: express.RequestHandler): this {
    this.preRequestMiddlwares.push(middleware)
    return this
  }

  addRouteMiddleware (route: Route, middleware: express.RequestHandler): this {
    const existingMiddlewares = this.routeMiddlewares.get(route) ?? []
    this.routeMiddlewares.set(route, [...existingMiddlewares, middleware])
    return this
  }

  setErrorHandler (handler: express.ErrorRequestHandler): this {
    this.errorHandler = handler
    return this
  }

  addRoute (route: string): express.IRoute {
    return this.router.route(route)
  }

  build (): express.Application {
    this.app.use(cors())
    this.app.use(bodyParser.json())
    this.app.use(eventContext())
    this.app.use(function (_: unknown, res: any, next: any) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', '*')
      next()
    })
    this.app.use(this.authorizer)
    if (this.preRequestMiddlwares.length > 0) {
      this.app.use(...this.preRequestMiddlwares)
    }
    this.router.route('/agent/new-conversation').post(
      ...this.routeMiddlewares.get(Route.NewConversation) ?? [],
      NewConersationRequestHandler(this.application)
    )
    this.router.route('/agent/:conversationId/reply-as-user').post(
      ...this.routeMiddlewares.get(Route.ReplyAsUser) ?? [],
      ReplyAsUserRequestHandler(this.application)
    )
    this.router.route('/agent/:conversationId/reply-as-tool').post(
      ...this.routeMiddlewares.get(Route.ReplyAsTool) ?? [],
      ReplyAsToolRequestHandler(this.application)
    )
    this.router.route('/storage/conversation/:conversationId').get(
      ...this.routeMiddlewares.get(Route.GetConversationById) ?? [],
      GetConversationById(this.application)
    )
    this.app.use(this.router)
    if (this.errorHandler) {
      this.app.use(this.errorHandler)
    } else {
      this.app.use(defaultErrorMiddleware)
    }

    return this.app
  }
}
