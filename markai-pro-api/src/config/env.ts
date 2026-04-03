import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  APP_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string(),

  DATABASE_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('30d'),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  REDIS_URL: z.string().default('redis://localhost:6379'),

  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL_PRIMARY: z.string().default('gpt-4o'),
  OPENAI_MODEL_FAST: z.string().default('gpt-4o-mini'),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-4-5'),
  AI_PROVIDER: z.enum(['openai', 'anthropic', 'auto']).default('openai'),
  AI_FALLBACK_ENABLED: z.coerce.boolean().default(true),
  AI_TIMEOUT_MS: z.coerce.number().default(30000),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_STARTER_MONTHLY: z.string().optional(),
  STRIPE_PRICE_STARTER_ANNUAL: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY: z.string().optional(),
  STRIPE_PRICE_PRO_ANNUAL: z.string().optional(),
  STRIPE_PRICE_AGENCY_MONTHLY: z.string().optional(),
  STRIPE_PRICE_AGENCY_ANNUAL: z.string().optional(),

  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email(),
  EMAIL_REPLY_TO: z.string().email(),

  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_KEY: z.string().optional(),
  SUPABASE_BUCKET_ASSETS: z.string().default('markai-assets'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX_FREE: z.coerce.number().default(20),
  RATE_LIMIT_MAX_STARTER: z.coerce.number().default(60),
  RATE_LIMIT_MAX_PRO: z.coerce.number().default(120),
  RATE_LIMIT_MAX_AGENCY: z.coerce.number().default(300),

  CREDITS_FREE: z.coerce.number().default(50),
  CREDITS_STARTER: z.coerce.number().default(500),
  CREDITS_PRO: z.coerce.number().default(2000),
  CREDITS_AGENCY: z.coerce.number().default(10000),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
export type Env = typeof env
