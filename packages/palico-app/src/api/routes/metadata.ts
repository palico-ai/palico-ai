import * as express from 'express';
import { AgentModel } from '../../agent/model';

interface AgentMetadata {
  name: string;
}

const router = express.Router();

router.route('/agents').get(async (_, res) => {
  const agentList = await AgentModel.getAllAgents();
  const agents: AgentMetadata[] = agentList.map((agentName) => {
    return { name: agentName };
  });
  return res.status(200).json(agents);
});

export default router;
