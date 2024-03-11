import { type APIRequestHandler } from './types'

export const ReplyAsToolRequestHandler: APIRequestHandler = (app) => async (req, res, next) => {
  try {
    // TODO: Verify request input
    const { toolOutputs } = req.body
    const conversationId = parseInt(req.params["conversationId"])
    const response = await app.replyAsTool({
      conversationId,
      toolOutputs
    })
    return res.status(200).json(response)
  } catch (error) {
    return next(error)
  }
}
