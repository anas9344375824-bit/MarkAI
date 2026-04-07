import { z } from 'zod'

export const localSeoSchema = z.object({
  businessName: z.string().min(2),
  businessType: z.string().min(2),
  city: z.string().min(2),
  targetCities: z.array(z.string()).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a Local SEO expert. Help halal businesses dominate local search results.
Output JSON:
{
  "googleBusinessDescription": "",
  "locationKeywords": [""],
  "napContent": { "name": "", "address": "", "phone": "" },
  "localLandingPages": [{ "city": "", "title": "", "metaDescription": "", "content": "" }],
  "citationSites": [{ "site": "", "url": "", "priority": "High|Medium|Low" }],
  "localSchemaMarkup": {},
  "priorityActions": [{ "action": "", "impact": "High|Medium|Low" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof localSeoSchema>): string => `
Business Name: ${inputs.businessName}
Business Type: ${inputs.businessType}
Primary City: ${inputs.city}
Target Cities: ${inputs.targetCities?.join(', ') ?? 'same city only'}
Phone: ${inputs.phone ?? 'not provided'}
Address: ${inputs.address ?? 'not provided'}
Build a complete local SEO strategy with Google Business Profile, citations, and landing pages.
`.trim()
