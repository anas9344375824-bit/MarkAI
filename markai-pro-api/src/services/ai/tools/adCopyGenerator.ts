import { z } from 'zod'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe } from '../../../utils/helpers'

export const adCopySchema = z.object({
  platform: z.enum(['GOOGLE_ADS','META_ADS','LINKEDIN','TIKTOK']),
  product: z.string().min(3),
  targetAudience: z.string().min(3),
  goal: z.enum(['awareness','leads','sales','app-installs','traffic']),
  usp: z.string().min(3),
  tone: z.string().default('Professional'),
  variantCount: z.coerce.number().min(1).max(5).default(3),
})
export type AdCopyInputs = z.infer<typeof adCopySchema>

export const SYSTEM_PROMPT = `
You are a performance marketing copywriter who writes ads that convert.

Character limits:
- Google Ads: Headline 30 chars, Description 90 chars
- Meta/Facebook: Primary text 125 chars, headline 40 chars
- LinkedIn: Headline 70 chars, description 100 chars
- TikTok: Text overlay 100 chars, caption 150 chars

Output JSON:
{
  "platform": "GOOGLE_ADS",
  "adType": "search|display|social|video",
  "variants": [
    {
      "variantName": "Variant A — Problem-led",
      "headlines": ["h1","h2","h3"],
      "descriptions": ["d1","d2"],
      "primaryText": "for social ads",
      "cta": "Shop Now",
      "angle": "psychological angle used",
      "targetAwarenessLevel": "unaware|problem-aware|solution-aware|product-aware|most-aware"
    }
  ],
  "audienceNotes": "targeting suggestions",
  "budgetTip": "bid strategy suggestion"
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: AdCopyInputs, brandVoice?: BrandVoice | null): string => `
Write ${inputs.variantCount} ad copy variants for:

PLATFORM: ${inputs.platform}
PRODUCT/SERVICE: ${inputs.product}
TARGET AUDIENCE: ${inputs.targetAudience}
CAMPAIGN GOAL: ${inputs.goal}
UNIQUE SELLING POINT: ${inputs.usp}
TONE: ${inputs.tone}
${brandVoice?.systemPrompt ? `BRAND VOICE:\n${brandVoice.systemPrompt}` : ''}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<{
  platform: string; adType: string
  variants: Array<{
    variantName: string; headlines: string[]; descriptions: string[]
    primaryText: string; cta: string; angle: string; targetAwarenessLevel: string
  }>
  audienceNotes: string; budgetTip: string
}>(raw)
