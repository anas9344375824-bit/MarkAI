import { z } from 'zod'

export const offPageSeoSchema = z.object({
  website: z.string().url(),
  niche: z.string().min(2),
  targetKeyword: z.string().min(2),
  currentDa: z.coerce.number().optional(),
})

export const SYSTEM_PROMPT = `
You are an expert Off-Page SEO strategist. Help users build high-quality halal backlinks and brand authority.
Output JSON:
{
  "backlinkOpportunities": [{ "site": "", "type": "guest_post|directory|forum|resource", "da": 0, "url": "", "pitch": "" }],
  "guestPostPitch": "",
  "outreachEmail": "",
  "linkWorthyContentIdeas": [""],
  "brandMentionStrategy": "",
  "priorityActions": [{ "action": "", "impact": "High|Medium|Low", "effort": "Easy|Medium|Hard" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof offPageSeoSchema>): string => `
Website: ${inputs.website}
Niche: ${inputs.niche}
Target Keyword: ${inputs.targetKeyword}
Current DA: ${inputs.currentDa ?? 'unknown'}
Build a complete off-page SEO strategy with backlink opportunities, guest post pitch, and outreach email.
`.trim()
