import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-pharmo-key-change-in-prod',
  databaseUrl: process.env.DATABASE_URL,
  groqApiKey: process.env.GROQ_API_KEY || '',
};