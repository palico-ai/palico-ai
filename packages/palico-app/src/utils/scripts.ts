import { JWTAuthenticator, commonConfig } from '@palico-ai/common';

export const getServiceKey = async () => {
  const secret = commonConfig.getSecretKey();
  if (!secret) {
    throw new Error(
      'Secret key not found. Please set JWT_SECRET in your environment variables.'
    );
  }
  const token = await JWTAuthenticator.generateAPIJWT(
    { role: 'apikey' },
    secret
  );
  return token;
};
