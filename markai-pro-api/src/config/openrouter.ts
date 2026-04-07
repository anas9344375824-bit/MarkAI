import OpenAI from 'openai'
import { env } from './env'

// OpenRouter uses OpenAI-compatible API
export const openrouter = new OpenAI({
  apiKey: env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': env.APP_URL,
    'X-Title': 'MarkAI Pro',
  },
  timeout: env.AI_TIMEOUT_MS,
  maxRetries: 2,
})

// Each category has a free model first, then paid fallback
export const CATEGORY_MODELS: Record<string, string[]> = {
  seo:        ['google/gemma-3-27b-it:free',              'google/gemini-flash-1.5'],
  content:    ['google/gemma-3-27b-it:free',              'google/gemini-flash-1.5'],
  blog:       ['google/gemma-3-27b-it:free',              'google/gemini-flash-1.5'],

  marketing:  ['meta-llama/llama-4-scout:free',           'meta-llama/llama-4-scout'],
  ads:        ['meta-llama/llama-4-scout:free',           'meta-llama/llama-4-scout'],
  email:      ['meta-llama/llama-4-scout:free',           'meta-llama/llama-4-scout'],
  campaign:   ['meta-llama/llama-4-scout:free',           'meta-llama/llama-4-scout'],

  analytics:  ['deepseek/deepseek-r1-0528:free',          'deepseek/deepseek-chat'],
  roi:        ['deepseek/deepseek-r1-0528:free',          'deepseek/deepseek-chat'],
  competitor: ['deepseek/deepseek-r1-0528:free',          'deepseek/deepseek-chat'],

  brand:      ['mistralai/mistral-small-3.2-24b-instruct:free', 'mistralai/mistral-small'],
  strategy:   ['mistralai/mistral-small-3.2-24b-instruct:free', 'mistralai/mistral-small'],
  persona:    ['mistralai/mistral-small-3.2-24b-instruct:free', 'mistralai/mistral-small'],

  social:     ['meta-llama/llama-4-maverick:free',        'meta-llama/llama-4-maverick'],
  viral:      ['meta-llama/llama-4-maverick:free',        'meta-llama/llama-4-maverick'],
  caption:    ['meta-llama/llama-4-maverick:free',        'meta-llama/llama-4-maverick'],
  video:      ['meta-llama/llama-4-maverick:free',        'meta-llama/llama-4-maverick'],

  default:    ['meta-llama/llama-4-scout:free',           'meta-llama/llama-4-scout'],
}
