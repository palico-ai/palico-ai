import OS from "../../utils/os";
import Project from "../../utils/project";

export const GenerateNewExperiment = async (name: string) => {
  const rootDir = await Project.getExperimentRootDir();
  const testPath = `${rootDir}/${name}/tests/test1.ts`;
  await OS.createFile(testPath, `console.log('Hello, ${name}!');`);
}