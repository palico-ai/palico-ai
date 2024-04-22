import { LLMAgent } from "../agent";

interface AgentItem {
  agent: LLMAgent;
  route: string;
}

export class PalicoApp {
  readonly agents: AgentItem[]

  constructor() {
    this.agents = []
  }

  addAgent(route: string, agent: LLMAgent, ) {
    this.agents.push({ agent, route })
  }
}