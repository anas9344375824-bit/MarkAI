import { z } from 'zod'

export const voiceSearchSeoSchema = z.object({
  keyword: z.string().min(2),
  businessType: z.string().min(2),
  location: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a Voice Search SEO expert. Optimize content for Alexa, Siri, and Google Assistant.
Output JSON:
{
  "questionKeywords": [""],
  "faqSection": [{ "question": "", "answer": "" }],
  "nearMeKeywords": [""],
  "featuredSnippetStrategy": "",
  "speakableSchema": {},
  "conversationalContent": "",
  "priorityActions": [{ "action": "", "impact": "High|Medium|Low" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof voiceSearchSeoSchema>): string => `
Keyword: ${inputs.keyword}
Business Type: ${inputs.businessType}
Location: ${inputs.location ?? 'not specified'}
Build a voice search SEO strategy with FAQ, featured snippets, and speakable schema.
`.trim()
