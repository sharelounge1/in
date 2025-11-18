import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Payment Gateway (Naver Pay)
  NAVER_PAY_CLIENT_ID: z.string().optional(),
  NAVER_PAY_CLIENT_SECRET: z.string().optional(),

  // Import (Portone) - optional
  IMP_KEY: z.string().optional(),
  IMP_SECRET: z.string().optional(),

  // Redis (for Bull queue)
  REDIS_URL: z.string().url().optional(),

  // File upload
  MAX_FILE_SIZE: z.string().default('10485760').transform(Number), // 10MB
  UPLOAD_PATH: z.string().default('./uploads'),

  // App settings
  DEFAULT_FEE_RATE: z.string().default('10').transform(Number),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment validation failed:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;
