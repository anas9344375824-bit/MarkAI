import Anthropic from '@anthropic-ai/sdk'
import { env } from './env'

export const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY ?? '',
  timeout: env.AI_TIMEOUT_MS,
  maxRetries: 2,
})
