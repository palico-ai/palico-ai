// import { type UserConfig } from '../user_app/types'
// import CurrentProject from '../utils/current_project'
// import EventHandler from './request_handler'

import { Application } from '../app'
import { type StorageService } from '../storage'
import { CurrentProject } from '../utils'
import type * as express from 'express'
import { ExpressAPIBuilder } from './express_api_builder'
import { defaultRequestAuthorizer } from './middlewares/local_authorizer'

interface CreateAPIServerOptions {
  storage: StorageService
}

// Using the current application config, creates an API Server
export const CreateApplicationAPIServer = async (params: CreateAPIServerOptions): Promise<express.Application> => {
  const appConfig = await CurrentProject.getApplicationAPIConfig()
  const app = new Application({
    promptBuilder: appConfig.promptBuilder,
    tools: appConfig.toolset?.tools ?? [],
    model: {
      model: appConfig.model,
      openaiApiKey: appConfig.openaiApiKey
    },
    storage: params.storage
  })
  const api = new ExpressAPIBuilder({
    application: app,
    authorizer: defaultRequestAuthorizer
  })
  return api.build()
}
