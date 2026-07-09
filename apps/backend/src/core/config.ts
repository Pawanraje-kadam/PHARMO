import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(key: string): string {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV === 'production') {
    console.error(`[CONFIG] Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value || '';
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      console.error('[CONFIG] JWT_SECRET is required in production');
      process.exit(1);
    }
    return 'dev-secret-do-not-use-in-production';
  })(),
  databaseUrl: required('DATABASE_URL'),
  groqApiKey: process.env.GROQ_API_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};