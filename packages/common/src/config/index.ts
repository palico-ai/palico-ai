import * as dotenv from 'dotenv';

dotenv.config();

class CommonConfig {
  getSecretKey(): string {
    const secret = process.env['JWT_SECRET'] ?? 'local-secret';
    return secret;
  }
}

export const commonConfig = new CommonConfig();
