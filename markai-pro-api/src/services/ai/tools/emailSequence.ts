import { z } from 'zod'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe } from '../../../utils/helpers'

export const emailSequenceSchema = z.object({
  goal: z.string().min(3),
  audience: z.string().min(3),
  product: z.string().min(3),
  type: z.enum(['welcome','nurture','sales','re-engagement','post-purchase','onboarding']),
  emailCount: z.coerce.number().min(1).max(10).default(3),
  tone: z.string().default('Friendly'),
  benefits: z.string().optional(),
  objections: z.string().optional(),
})
export type EmailSequenceInputs = z.infer<typeof emailSequenceSchema>

export const SYSTEM_PROMPT = `
You are an email marketing specialist with deep expertise in behavioural psychology, copywriting, and conversion rate optimisation.

You write email sequences that:
- Have subject lines with 40%+ open rate potential
- Use PAS and AIDA frameworks naturally
- Build a logical progression from awareness → trust → purchase
- Feel personal and human, never corporate
- Include clear single CTAs
- Are mobile-optimised (300-500 words per email)

Output a JSON object:
{
  "sequenceName": "name",
  "goal": "primary goal",
  "emails": [
    {
      "emailNumber": 1,
      "sendDelay": "immediately",
      "subjectLine": "subject",
      "subjectVariants": ["v1","v2"],
      "preheader": "preheader text",
      "body": "full email body in markdown",
      "cta": "CTA button text",
      "ctaUrl": "{{CTA_URL}}",
      "wordCount": number,
      "psychologyTrigger": "scarcity|social proof|authority|reciprocity|curiosity"
    }
  ],
  "totalEmails": number,
  "estimatedDuration": "X days"
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: EmailSequenceInputs, brandVoice?: BrandVoice | null): string => `
Build a complete email sequence:

GOAL: ${inputs.goal}
AUDIENCE: ${inputs.audience}
PRODUCT/SERVICE: ${inputs.product}
SEQUENCE TYPE: ${inputs.type}
NUMBER OF EMAILS: ${inputs.emailCount}
TONE: ${inputs.tone}
KEY BENEFITS: ${inputs.benefits || 'not specified'}
MAIN OBJECTIONS: ${inputs.objections || 'not specified'}
${brandVoice?.systemPrompt ? `BRAND VOICE:\n${brandVoice.systemPrompt}` : ''}

Write the complete sequence. Each email should have a distinct purpose.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<{
  sequenceName: string; goal: string; emails: Array<{
    emailNumber: number; sendDelay: string; subjectLine: string
    subjectVariants: string[]; preheader: string; body: string
    cta: string; ctaUrl: string; wordCount: number; psychologyTrigger: string
  }>; totalEmails: number; estimatedDuration: string
}>(raw)
