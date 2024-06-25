import * as JWT from 'jsonwebtoken';

export type JWTPayload = {
  role: 'admin' | 'apikey' | 'studio';
};

export class JWTAuthenticator {
  static async generateAPIJWT(
    payload: JWTPayload,
    secret: string
  ): Promise<string> {
    return await new Promise((resolve, reject) => {
      JWT.sign(
        {
          ...payload,
        },
        secret,
        {},
        (err, token) => {
          if (err ?? !token) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
  }

  static async decodeJWTToken<JWTPayload>(
    token: string,
    secret: string
  ): Promise<JWTPayload> {
    const tokenPart = token.includes(' ') ? token.split(' ')[1] : token;
    return await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JWT.verify(tokenPart, secret, (err, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
