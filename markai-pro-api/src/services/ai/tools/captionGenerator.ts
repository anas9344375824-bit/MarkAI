import { z } from 'zod'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe } from '../../../utils/helpers'

export const captionSchema = z.object({
  topic: z.string().min(3).max(500),
  platforms: z.array(z.enum(['INSTAGRAM','LINKEDIN','TIKTOK','TWITTER','FACEBOOK'])).min(1),
  goal: z.enum(['engagement', 'traffic', 'sales', 'awareness']),
  tone: z.string().default('Friendly'),
  context: z.string().max(500).optional(),
  includeEmoji: z.boolean().default(true),
})
export type CaptionInputs = z.infer<typeof captionSchema>

export const SYSTEM_PROMPT = `
You are a social media copywriter who specialises in writing captions that stop the scroll, spark engagement, and drive action.

Platform rules:
- Instagram: storytelling + emotion + hashtags (20-30 relevant ones)
- LinkedIn: professional insight + personal story + 1 CTA (max 5 hashtags)
- TikTok: hook in first 3 words + conversational + CTA
- Twitter/X: punchy + single insight + max 2 hashtags
- Facebook: community-focused + question to drive comments

Output a JSON array. Each object:
{
  "platform": "INSTAGRAM"|"LINKEDIN"|"TIKTOK"|"TWITTER"|"FACEBOOK",
  "caption": "full caption text",
  "hashtags": ["tag1","tag2"],
  "characterCount": number,
  "hook": "the opening hook",
  "cta": "the call to action",
  "emojiUsed": boolean
}
Return ONLY the JSON array.
`.trim()

export const buildUserPrompt = (inputs: CaptionInputs, brandVoice?: BrandVoice | null): string => `
Create captions for the following:

TOPIC: ${inputs.topic}
PLATFORMS: ${inputs.platforms.join(', ')}
GOAL: ${inputs.goal}
TONE: ${inputs.tone}
CONTEXT: ${inputs.context || 'Not provided'}
${inputs.includeEmoji ? 'Include relevant emojis' : 'No emojis'}
${brandVoice?.systemPrompt ? `BRAND VOICE:\n${brandVoice.systemPrompt}` : ''}

Generate one excellent caption per platform. Make each feel native to that platform.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Array<{
  platform: string; caption: string; hashtags: string[]
  characterCount: number; hook: string; cta: string; emojiUsed: boolean
}>>(raw)
