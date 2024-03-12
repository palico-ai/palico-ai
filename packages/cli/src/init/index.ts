import * as path from "path";
import * as chalk from "chalk";
import { copyDirectory } from "../utils/copy";
import { createFile } from "../utils/create_file";
import { runCommands } from "../utils/run_command";

const ENV_FILE_CONTENT = `OPENAI_API_KEY=""
OPENAI_MODEL="gpt-3.5-turbo-0125"
API_PORT=8000
JWT_SECRET="secret"
`;

export const InitHandler = async (projectName: string) => {
  if (!projectName || projectName.length === 0) {
    throw new Error("Project name is required");
  }
  console.log(`Initializing ${projectName}...`);
  const templateDirectory = path.join(
    __dirname,
    "..",
    "..",
    "templates",
    "base"
  );
  const destinationDirectory = path.join(process.cwd(), projectName);
  await copyDirectory(templateDirectory, destinationDirectory);
  await runCommands([`cd ${projectName} && npm install && npm install @palico-ai/app`]);
  await createFile(path.join(destinationDirectory, ".env"), ENV_FILE_CONTENT);
  const nextSteps = [
    `Navigate to the project directory: ${chalk.greenBright(`cd ${projectName}`)}`,
    `Update ${chalk.greenBright(".env")} with your OpenAI API key and model`,
    `Run ${chalk.greenBright("npm start")} to start the application`,
  ];
  console.log(chalk.green("Project initialized!"));
  console.log(chalk.blue("Next Steps:"));
  nextSteps.forEach((step, index) => {
    console.log(chalk.blue(`${index + 1}. ${step}`));
  });
};
