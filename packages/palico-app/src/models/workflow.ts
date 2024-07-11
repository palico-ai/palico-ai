import path from 'path';
import OS from '../utils/os';
import Project from '../utils/project';
import { ChainWorkflow } from '../workflows';

export default class WorkflowModel {
  private static readonly workflowFile = 'index.ts';

  static async getAllWorkflows() {
    const workflowDirName = await Project.getWorkflowRootDir();
    const dirs = await OS.getDirectories(workflowDirName);
    const workflows = dirs.filter((dir) =>
      OS.doesFileExist(
        path.join(workflowDirName, dir, WorkflowModel.workflowFile)
      )
    );
    return workflows;
  }

  static async doesWorkflowExist(name: string): Promise<boolean> {
    const filePath = await WorkflowModel.workflowFilePath(name);
    return OS.doesFileExist(filePath);
  }

  static async getWorkflowByName(name: string): Promise<ChainWorkflow> {
    const filePath = await WorkflowModel.workflowFilePath(name);
    const workflow = await import(filePath);
    return workflow.default;
  }

  private static async workflowFilePath(name: string) {
    const workflowDir = await Project.getWorkflowRootDir();
    return path.join(workflowDir, name, WorkflowModel.workflowFile);
  }
}
