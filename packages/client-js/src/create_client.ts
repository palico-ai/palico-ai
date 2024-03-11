import { type ClientReplyAsUserFN, type ClientNewConversationFN, type IPalicoClient, type ClientReplyToToolCallFN } from './types'

interface ClientConfig {
  apiURL: string
  serviceKey: string
}

export const createClient = (config: ClientConfig): IPalicoClient => {
  const { apiURL, serviceKey } = config

  const newConversation: ClientNewConversationFN = async (params) => {
    const payload = {
      message: params.message,
      context: params.context
    }
    const response = await fetch(`${apiURL}/agent/new-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`
      },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (response.status !== 200) {
      console.error(data)
      throw new Error(JSON.stringify(data, null, 2))
    }
    return data
  }

  const replyAsUser: ClientReplyAsUserFN = async (params) => {
    const response = await fetch(`${apiURL}/agent/${params.conversationId}/reply-as-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`
      },
      body: JSON.stringify({
        message: params.message,
        context: params.context
      })
    })
    const data = await response.json()
    if (response.status !== 200) {
      console.error(data)
      throw new Error(JSON.stringify(data, null, 2))
    }
    return data
  }

  const replyToToolCall: ClientReplyToToolCallFN = async (params) => {
    const payload = {
      toolOutputs: params.toolOutputs
    }
    const response = await fetch(`${apiURL}/agent/${params.conversationId}/reply-as-tool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`
      },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (response.status !== 200) {
      console.error(data)
      throw new Error(JSON.stringify(data, null, 2))
    }
    return data
  }

  return {
    newConversation,
    replyAsUser,
    replyToToolCall
  }
}
