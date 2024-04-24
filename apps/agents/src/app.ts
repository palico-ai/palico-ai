import { PalicoApp } from "@palico-ai/app"
import { ConversationalAgent } from "./agent"

const app = new PalicoApp()
const agent = new ConversationalAgent()

app.addAgent('v1', agent)
app.addAgent('v2', agent)

export default app
