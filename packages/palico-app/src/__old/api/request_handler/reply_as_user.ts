import { type APIRequestHandler } from './types'
import { type Application } from '../../app'

export const ReplyAsUserRequestHandler: APIRequestHandler = (app: Application) => async (req, res, next) => {
  try {
    // TODO: Verify request input
    const { message, context } = req.body
    const conversationId = parseInt(req.params["conversationId"])
    const response = await app.replyAsUser({
      conversationId,
      message,
      context
    })
    return res.status(200).json(response)
  } catch (error) {
    return next(error)
  }
}
