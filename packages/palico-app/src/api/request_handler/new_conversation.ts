import { type APIRequestHandler } from './types'

export const NewConersationRequestHandler: APIRequestHandler = (app) => async (req, res, next) => {
  try {
    const {
      message,
      context
    } = req.body
    const response = await app.replyAsUser({
      message,
      context
    })
    return res.status(200).json(response)
  } catch (error) {
    return next(error)
  }
}
