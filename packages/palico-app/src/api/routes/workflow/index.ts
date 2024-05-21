import { Router } from "express";
import { runWorkflowHandler } from "./handler";

const router = Router();

router.route("/:workflowName/run").post(runWorkflowHandler);

export default router;