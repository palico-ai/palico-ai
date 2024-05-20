import { PalicoApp } from "@palico-ai/app"
import { ConversationalAgent } from "./agent"

const app = new PalicoApp()
const agent = new ConversationalAgent()

app.addAgent(ConversationalAgent.agentId, agent)

export default app
