import { z } from 'zod'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe } from '../../../utils/helpers'

export const videoScriptSchema = z.object({
  topic: z.string().min(3),
  platform: z.enum(['YOUTUBE','TIKTOK','INSTAGRAM','LINKEDIN']),
  duration: z.enum(['30s','60s','3min','5min','10min']),
  goal: z.string(),
  audience: z.string(),
  tone: z.string().default('Conversational'),
})
export type VideoScriptInputs = z.infer<typeof videoScriptSchema>

export const SYSTEM_PROMPT = `
You are a professional video scriptwriter who creates scripts that get watched to the end and drive action.

Structure every script with:
- HOOK (first 3-5 seconds): pattern interrupt that stops the scroll
- INTRO (5-10s): who this is for and what they'll get
- BODY: main content with clear transitions
- CTA: specific, single action to take

Output JSON:
{
  "title": "video title",
  "hook": "opening hook (verbatim)",
  "intro": "intro section",
  "sections": [{ "heading": "section name", "script": "verbatim script", "durationEstimate": "Xs" }],
  "cta": "closing call to action",
  "totalDuration": "estimated duration",
  "bRollSuggestions": ["suggestion1","suggestion2"],
  "thumbnailIdeas": ["idea1","idea2"]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: VideoScriptInputs, brandVoice?: BrandVoice | null): string => `
Write a complete video script:

TOPIC: ${inputs.topic}
PLATFORM: ${inputs.platform}
TARGET DURATION: ${inputs.duration}
GOAL: ${inputs.goal}
AUDIENCE: ${inputs.audience}
TONE: ${inputs.tone}
${brandVoice?.systemPrompt ? `BRAND VOICE:\n${brandVoice.systemPrompt}` : ''}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<{
  title: string; hook: string; intro: string
  sections: Array<{ heading: string; script: string; durationEstimate: string }>
  cta: string; totalDuration: string; bRollSuggestions: string[]; thumbnailIdeas: string[]
}>(raw)
