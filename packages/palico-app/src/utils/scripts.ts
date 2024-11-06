import { JWTAuthenticator, commonConfig } from '@palico-ai/common';

export interface GenerateServiceKeyParams {
  secret?: string;
}

export const getServiceKey = async (
  params: GenerateServiceKeyParams = {
    secret: commonConfig.getSecretKey(),
  }
) => {
  const secret = params.secret;
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
