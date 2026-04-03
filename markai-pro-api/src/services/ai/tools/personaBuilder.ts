import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const personaSchema = z.object({
  product: z.string().min(3),
  industry: z.string(),
  targetDescription: z.string().min(10),
  personaCount: z.coerce.number().min(1).max(5).default(2),
})

export const SYSTEM_PROMPT = `
You are a market research specialist who creates detailed ideal customer profiles (ICPs) that marketers use to craft hyper-targeted messaging.

Output JSON:
{
  "personas": [
    {
      "name": "persona name (e.g. 'Marketing Mary')",
      "age": "age range",
      "jobTitle": "typical job title",
      "industry": "industry",
      "income": "income range",
      "goals": ["goal1","goal2","goal3"],
      "painPoints": ["pain1","pain2","pain3"],
      "fears": ["fear1","fear2"],
      "motivations": ["motivation1","motivation2"],
      "objections": ["objection1","objection2"],
      "preferredChannels": ["channel1","channel2"],
      "contentPreferences": ["type1","type2"],
      "buyingTriggers": ["trigger1","trigger2"],
      "messagingHooks": ["hook1","hook2","hook3"],
      "dayInLife": "brief narrative of their typical day",
      "quote": "a quote this persona might say about their problem"
    }
  ]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof personaSchema>): string => `
Create ${inputs.personaCount} detailed buyer persona(s) for:

PRODUCT/SERVICE: ${inputs.product}
INDUSTRY: ${inputs.industry}
TARGET DESCRIPTION: ${inputs.targetDescription}

Make each persona specific, realistic, and actionable for marketing.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
