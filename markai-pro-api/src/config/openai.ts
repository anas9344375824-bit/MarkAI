import OpenAI from 'openai'
import { env } from './env'

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  timeout: env.AI_TIMEOUT_MS,
  maxRetries: 2,
})
