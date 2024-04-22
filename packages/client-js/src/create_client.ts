import { type ClientReplyAsUserFN, type ClientNewConversationFN, type IPalicoClient, type ClientReplyToToolCallFN } from './types'

interface ClientConfig {
  apiURL: string
  serviceKey: string
}

export const createClient = (config: ClientConfig): IPalicoClient => {
  const { apiURL, serviceKey } = config

  const newConversation: ClientNewConversationFN = async (params) => {
    const response = await fetch(`${apiURL}/agent/${params.agentId}/conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`
      },
      body: JSON.stringify({
        userMessage: params.userMessage,
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

  const replyAsUser: ClientReplyAsUserFN = async (params) => {
    const response = await fetch(`${apiURL}/agent/${params.agentId}/${params.conversationId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`
      },
      body: JSON.stringify({
        userMessage: params.userMessage,
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

  // @deprecated
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

  const getAgentsMetadata = async () => {
    const response = await fetch(`${apiURL}/metadata/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`
      }
    })
    const data = await response.json()
    if (response.status !== 200) {
      console.error(data)
      throw new Error(JSON.stringify(data, null, 2))
    }
    return data
  }

  return {
    agents: {
      newConversation,
      replyAsUser,
      replyToToolCall
    },
    metadata: {
      getAgentsMetadata
    }
  }
}
