import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const funnelPlannerSchema = z.object({
  goal: z.string().min(3),
  product: z.string().min(3),
  audience: z.string().min(3),
  platforms: z.array(z.string()).min(1),
  timeline: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a marketing funnel strategist who creates complete content maps from awareness to conversion.

Output JSON:
{
  "funnelName": "funnel name",
  "goal": "primary conversion goal",
  "stages": [
    {
      "stage": "Awareness|Interest|Consideration|Intent|Conversion|Retention",
      "objective": "what to achieve at this stage",
      "audienceMindset": "what the audience is thinking",
      "contentTypes": ["type1","type2"],
      "platforms": ["platform1"],
      "contentIdeas": [
        { "title": "content piece title", "type": "blog|video|ad|email|social", "platform": "", "purpose": "" }
      ],
      "kpis": ["metric1","metric2"],
      "cta": "what action to drive"
    }
  ],
  "totalContentPieces": number,
  "estimatedTimeline": "X weeks",
  "budgetAllocation": { "awareness": "40%", "consideration": "30%", "conversion": "30%" }
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof funnelPlannerSchema>): string => `
Create a complete marketing funnel content map for:

GOAL: ${inputs.goal}
PRODUCT/SERVICE: ${inputs.product}
TARGET AUDIENCE: ${inputs.audience}
PLATFORMS: ${inputs.platforms.join(', ')}
${inputs.timeline ? `TIMELINE: ${inputs.timeline}` : ''}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
