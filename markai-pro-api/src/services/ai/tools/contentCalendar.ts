import { z } from 'zod'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe } from '../../../utils/helpers'

export const contentCalendarSchema = z.object({
  goal: z.string().min(3),
  platforms: z.array(z.string()).min(1),
  startDate: z.string(),
  days: z.coerce.number().min(7).max(90).default(30),
  postsPerWeek: z.coerce.number().min(1).max(21).default(5),
  topics: z.array(z.string()).optional(),
})

export const SYSTEM_PROMPT = `
You are a social media strategist who creates comprehensive content calendars.

Output JSON:
{
  "calendarName": "calendar name",
  "period": "date range",
  "strategy": "overall content strategy summary",
  "contentPillars": ["pillar1","pillar2","pillar3"],
  "schedule": [
    {
      "date": "YYYY-MM-DD",
      "dayOfWeek": "Monday",
      "platform": "INSTAGRAM",
      "contentType": "post|story|reel|carousel",
      "topic": "specific topic",
      "angle": "the angle/hook",
      "caption": "draft caption",
      "hashtags": ["tag1","tag2"],
      "goal": "awareness|engagement|conversion"
    }
  ],
  "totalPosts": number,
  "platformBreakdown": { "INSTAGRAM": number, "LINKEDIN": number }
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof contentCalendarSchema>, brandVoice?: BrandVoice | null): string => `
Create a ${inputs.days}-day content calendar:

GOAL: ${inputs.goal}
PLATFORMS: ${inputs.platforms.join(', ')}
START DATE: ${inputs.startDate}
POSTS PER WEEK: ${inputs.postsPerWeek}
${inputs.topics?.length ? `CONTENT TOPICS: ${inputs.topics.join(', ')}` : ''}
${brandVoice?.systemPrompt ? `BRAND VOICE:\n${brandVoice.systemPrompt}` : ''}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
