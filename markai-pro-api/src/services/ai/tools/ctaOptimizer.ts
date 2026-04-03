import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const ctaSchema = z.object({
  currentCta: z.string().min(2),
  context: z.string().min(3),
  goal: z.string(),
  audience: z.string(),
})

export const SYSTEM_PROMPT = `
You are a conversion rate optimisation expert who transforms weak CTAs into high-converting ones.

Analyse the current CTA and provide improved versions using different psychological triggers.

Output JSON:
{
  "currentCtaAnalysis": { "weaknesses": ["w1","w2"], "score": number },
  "variants": [
    {
      "text": "CTA text",
      "trigger": "urgency|benefit|curiosity|social-proof|risk-reversal",
      "explanation": "why this works",
      "predictedLift": "estimated % improvement"
    }
  ],
  "topRecommendation": "best CTA with reasoning"
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof ctaSchema>): string => `
Optimise this CTA:

CURRENT CTA: "${inputs.currentCta}"
CONTEXT: ${inputs.context}
GOAL: ${inputs.goal}
AUDIENCE: ${inputs.audience}

Provide 5 improved variants with psychological reasoning.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
