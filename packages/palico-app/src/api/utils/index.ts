import { PalicoAPIServer } from ".."
import { APIError } from "../../errors"

export const getAgentById = (id: string) => {
  const agent = PalicoAPIServer.getInstance().app.agents.find(agent => agent.id === id)
  if (!agent) {
    throw APIError.notFound(`Agent with id ${id} not found`)
  }
  return agent
}