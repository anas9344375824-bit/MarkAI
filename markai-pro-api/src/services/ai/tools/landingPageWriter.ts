import { z } from 'zod'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe } from '../../../utils/helpers'

export const landingPageSchema = z.object({
  product: z.string().min(3),
  targetAudience: z.string().min(3),
  goal: z.string(),
  usp: z.string(),
  adHeadline: z.string().optional(),
  tone: z.string().default('Professional'),
})

export const SYSTEM_PROMPT = `
You are a conversion copywriter who writes landing pages that convert visitors into customers.

Every landing page must have:
- Hero: headline + subheadline + primary CTA
- Problem section: agitate the pain
- Solution section: introduce the product
- Features/Benefits: 3-5 key points
- Social proof: testimonial placeholders
- FAQ: 3-5 objection-handling questions
- Final CTA: urgency-driven close

Output JSON:
{
  "pageTitle": "SEO title",
  "hero": { "headline": "", "subheadline": "", "cta": "", "ctaSecondary": "" },
  "problem": { "heading": "", "body": "" },
  "solution": { "heading": "", "body": "" },
  "features": [{ "icon": "emoji", "title": "", "description": "" }],
  "socialProof": { "heading": "", "testimonials": [{ "quote": "", "name": "", "role": "" }] },
  "faq": [{ "q": "", "a": "" }],
  "finalCta": { "heading": "", "subtext": "", "cta": "" },
  "metaDescription": ""
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof landingPageSchema>, brandVoice?: BrandVoice | null): string => `
Write a complete landing page for:

PRODUCT/SERVICE: ${inputs.product}
TARGET AUDIENCE: ${inputs.targetAudience}
GOAL: ${inputs.goal}
UNIQUE SELLING POINT: ${inputs.usp}
${inputs.adHeadline ? `MATCHING AD HEADLINE: ${inputs.adHeadline}` : ''}
TONE: ${inputs.tone}
${brandVoice?.systemPrompt ? `BRAND VOICE:\n${brandVoice.systemPrompt}` : ''}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
