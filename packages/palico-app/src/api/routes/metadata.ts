import * as express from 'express';
import { PalicoApp } from '../../app';

interface AgentMetadata {
  id: string;
}

export const createMetadataRoutes = (app: PalicoApp) => {
  const router = express.Router({
    mergeParams: true,
  });

  router.route('/agents').get((_, res) => {
    const agents: AgentMetadata[] = app.agents.map((agent) => {
      return {
        id: agent.id,
      };
    });
    return res.status(200).json(agents);
  });

  return router;
};

