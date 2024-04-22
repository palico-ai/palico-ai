import { APIError } from '../apierror'
import { type APIRequestHandler } from './types'

export const GetConversationById: APIRequestHandler = (app) => async (req, res, next) => {
  try {
    const { id } = req.params
    const conversation = await app.storage.conversation.findById(parseInt(id))
    if (!conversation) {
      throw APIError.notFound('Conversation not found')
    }
    return res.status(200).json(conversation)
  } catch (error) {
    return next(error)
  }
}
