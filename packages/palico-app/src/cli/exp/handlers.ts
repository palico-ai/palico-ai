import OS from "../../utils/os";
import PalicoWorkspace from "../../utils/workspace";

export const GenerateNewExperiment = async (name: string) => {
  const rootDir = await PalicoWorkspace.getExperimentRootDir();
  const testPath = `${rootDir}/${name}/tests/test1.ts`;
  await OS.createFile(testPath, `console.log('Hello, ${name}!');`);
}