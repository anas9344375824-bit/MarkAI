import { z } from 'zod'

export const internationalSeoSchema = z.object({
  website: z.string().url(),
  sourceLanguage: z.string().default('en'),
  targetCountries: z.array(z.string()).min(1),
  content: z.string().optional(),
  keyword: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are an International SEO expert. Help businesses expand globally with proper multilingual SEO.
Output JSON:
{
  "hreflangTags": [""],
  "countryKeywords": [{ "country": "", "language": "", "keywords": [""] }],
  "localizedContent": [{ "country": "", "language": "", "title": "", "metaDescription": "", "content": "" }],
  "siteStructureAdvice": "",
  "culturalAdaptations": [{ "country": "", "advice": "" }],
  "priorityActions": [{ "action": "", "impact": "High|Medium|Low" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof internationalSeoSchema>): string => `
Website: ${inputs.website}
Source Language: ${inputs.sourceLanguage}
Target Countries: ${inputs.targetCountries.join(', ')}
Keyword: ${inputs.keyword ?? 'not provided'}
Content to localize: ${inputs.content ?? 'not provided'}
Build a complete international SEO strategy with hreflang tags and localized content.
`.trim()
