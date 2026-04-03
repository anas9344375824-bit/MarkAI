import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const abHeadlineSchema = z.object({
  topic: z.string().min(3),
  goal: z.string(),
  audience: z.string(),
  count: z.coerce.number().min(5).max(20).default(10),
})

export const SYSTEM_PROMPT = `
You are a conversion copywriter and behavioural psychologist who writes headlines that get clicked.

Score each headline on:
- Clarity (0-10): Is it immediately clear what this is about?
- Curiosity (0-10): Does it make you want to read more?
- Urgency (0-10): Does it create a sense of need?
- Specificity (0-10): Does it use numbers, names, or concrete details?
- Overall score (0-100)

Output JSON:
{
  "headlines": [
    {
      "text": "headline text",
      "type": "how-to|list|question|statement|curiosity|urgency|benefit",
      "psychologyPrinciple": "principle used",
      "scores": { "clarity": 8, "curiosity": 7, "urgency": 5, "specificity": 9 },
      "overallScore": 82,
      "notes": "why this works"
    }
  ],
  "topPick": "the single best headline",
  "recommendation": "which to A/B test and why"
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof abHeadlineSchema>): string => `
Generate ${inputs.count} headline variants for:

TOPIC: ${inputs.topic}
GOAL: ${inputs.goal}
AUDIENCE: ${inputs.audience}

Score each headline and recommend the best A/B test pair.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
