import { JWTAuthenticator, commonConfig } from "@palico-ai/common"
import { PreferenceStore } from "./preference_store"

interface AuthorizationTokenParams {
  currentSecret: string
  serviceKey: string
}

export const getServiceKey = async (): Promise<string> => {
  const preferenceKey = 'JWTAuth'
  const secret = commonConfig.getSecretKey()
  const currentAuth = await PreferenceStore.get<AuthorizationTokenParams>(preferenceKey)
  if (!currentAuth?.serviceKey) {
    console.log("Service Key doesn't exist...")
    console.log('Creating new service key')
    const serviceKey = await JWTAuthenticator.generateAPIJWT({ role: "admin" }, secret)
    await PreferenceStore.set(preferenceKey, {
      currentSecret: secret,
      serviceKey
    })
    return serviceKey
  }
  // If secret has changed
  if (currentAuth?.currentSecret !== secret) {
    console.log('JWT Secret has changed')
    console.log('Creating new JWT Secret')
    const serviceKey = await JWTAuthenticator.generateAPIJWT({ role: "admin" }, secret)
    await PreferenceStore.set<AuthorizationTokenParams>(preferenceKey, {
      currentSecret: secret,
      serviceKey
    })
    return serviceKey
  }
  return currentAuth.serviceKey
}
