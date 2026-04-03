import { z } from 'zod'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe } from '../../../utils/helpers'

export const repurposerSchema = z.object({
  originalContent: z.string().min(100),
  originalType: z.enum(['blog','email','video-transcript','podcast-transcript']),
  outputFormats: z.array(z.enum(['instagram-captions','linkedin-posts','tweets','email','video-script','tiktok-hooks'])).min(1),
})

export const SYSTEM_PROMPT = `
You are a content repurposing specialist who transforms one piece of content into many platform-native formats.

Output JSON:
{
  "originalSummary": "2-sentence summary of source content",
  "repurposed": {
    "instagram-captions": ["caption1","caption2","caption3"],
    "linkedin-posts": ["post1","post2"],
    "tweets": ["tweet1","tweet2","tweet3","tweet4","tweet5"],
    "email": { "subject": "", "body": "" },
    "video-script": { "hook": "", "body": "", "cta": "" },
    "tiktok-hooks": ["hook1","hook2","hook3"]
  },
  "keyInsights": ["insight1","insight2","insight3"]
}
Only include keys for requested output formats.
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof repurposerSchema>, brandVoice?: BrandVoice | null): string => `
Repurpose this ${inputs.originalType} content into: ${inputs.outputFormats.join(', ')}

ORIGINAL CONTENT:
---
${inputs.originalContent.substring(0, 6000)}
---
${brandVoice?.systemPrompt ? `BRAND VOICE:\n${brandVoice.systemPrompt}` : ''}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
