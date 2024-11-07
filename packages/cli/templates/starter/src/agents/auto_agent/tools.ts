import { Tool } from "@palico-ai/app";
import z from "zod";

export const tools: Tool<any, any>[] = [
  // server-side tool: get weather information
  {
    name: "getWeatherInformation",
    description: "show the weather in a given city to the user",
    parameters: z.object({ city: z.string() }),
    execute: async ({}: { city: string }) => {
      const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
      return {
        outlook:
          weatherOptions[Math.floor(Math.random() * weatherOptions.length)],
      };
    },
  },
  // client-side tool: ask for human confirmation
  {
    name: "askForConfirmation",
    description: "Ask the user for confirmation",
    parameters: z.object({
      message: z.string().describe("The message to ask for confirmation."),
    }),
  },
  // client-side tool: prompt the user for location
  {
    name: "getLocation",
    description:
      "Get the user location. Always ask run askForConfirmation() before running this tool.",
    parameters: z.object({}),
  },
];
