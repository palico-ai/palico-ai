import * as JWT from 'jsonwebtoken'
import config from '../config'
import { PreferenceStore } from './preference_store'

export default class JWTAuthenticator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async generateAPIJWT (payload: any, secret: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      JWT.sign(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        {
          ...payload
        },
        secret,
        {},
        (err, token) => {
          if (err ?? !token) {
            reject(err)
          } else {
            resolve(token)
          }
        }
      )
    })
  }

  static async decodeJWTToken<Payload> (token: string, secret: string): Promise<Payload> {
    const tokenPart = token.includes(' ') ? token.split(' ')[1] : token
    return await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JWT.verify(tokenPart, secret, (err, decoded: any) => {
        if (err) {
          reject(err)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          resolve(decoded)
        }
      })
    })
  }
}

interface AuthorizationTokenParams {
  currentSecret: string
  serviceKey: string
}

export const getServiceKey = async (): Promise<string> => {
  const preferenceKey = 'JWTAuth'
  const secret = process.env["JWT_SECRET"] ?? config.DefaultLocalSecret
  const currentAuth = await PreferenceStore.get<AuthorizationTokenParams>(preferenceKey)
  if (!currentAuth?.serviceKey) {
    console.log("Service Key doesn't exist...")
    console.log('Creating new service key')
    const serviceKey = await JWTAuthenticator.generateAPIJWT({ deploymentId: -1 }, secret)
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
    const serviceKey = await JWTAuthenticator.generateAPIJWT({ deploymentId: -1 }, secret)
    await PreferenceStore.set<AuthorizationTokenParams>(preferenceKey, {
      currentSecret: secret,
      serviceKey
    })
    return serviceKey
  }
  return currentAuth.serviceKey
}
