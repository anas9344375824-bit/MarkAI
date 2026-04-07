import { z } from 'zod'

export const whiteHatCheckerSchema = z.object({
  website: z.string().url(),
  strategy: z.string().min(10),
  tactics: z.array(z.string()).optional(),
})

export const SYSTEM_PROMPT = `
You are a White-Hat SEO compliance expert. Evaluate SEO strategies against Google guidelines and E-E-A-T principles.
Output JSON:
{
  "complianceScore": 0,
  "googleGuidelinesCheck": [{ "tactic": "", "status": "safe|grey-hat|black-hat", "reason": "" }],
  "eatAnalysis": { "experience": "", "expertise": "", "authoritativeness": "", "trustworthiness": "" },
  "riskyTactics": [{ "tactic": "", "risk": "", "safeAlternative": "" }],
  "whiteHatChecklist": [{ "item": "", "status": "pass|fail|warning", "advice": "" }],
  "penaltyRisks": [""],
  "priorityActions": [{ "action": "", "impact": "High|Medium|Low" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof whiteHatCheckerSchema>): string => `
Website: ${inputs.website}
SEO Strategy: ${inputs.strategy}
Specific Tactics: ${inputs.tactics?.join(', ') ?? 'not provided'}
Evaluate this SEO strategy for Google compliance, E-E-A-T, and white-hat best practices.
`.trim()
