import { JWTAuthenticator, commonConfig } from "@palico-ai/common"
import * as chalk from 'chalk'

export const GenerateJWTToken = async () : Promise<void> => {
  const secret = commonConfig.getSecretKey()
  if(!secret) {
    throw new Error("Secret key not found. Please set JWT_SECRET in your environment variables.")
  }
  console.log("Generating token...")
  const token = await JWTAuthenticator.generateAPIJWT({role: "admin"}, secret)
  console.log(chalk.blue('Token') + `: ${token}`)
}