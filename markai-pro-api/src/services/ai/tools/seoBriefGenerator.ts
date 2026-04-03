import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const seoBriefSchema = z.object({
  keyword: z.string().min(2),
  targetAudience: z.string(),
  competitorUrls: z.array(z.string()).optional(),
  wordCount: z.coerce.number().default(1500),
})

export const SYSTEM_PROMPT = `
You are an SEO content strategist who creates detailed briefs that writers use to produce top-ranking articles.

Output JSON:
{
  "keyword": "target keyword",
  "title": "recommended H1",
  "metaTitle": "SEO title (max 60 chars)",
  "metaDescription": "meta description (max 160 chars)",
  "searchIntent": "informational|navigational|transactional|commercial",
  "targetWordCount": number,
  "outline": [
    { "heading": "H2 heading", "type": "H2", "notes": "what to cover", "subheadings": [{ "heading": "H3", "notes": "" }] }
  ],
  "mustIncludeKeywords": ["kw1","kw2"],
  "mustAnswerQuestions": ["q1","q2"],
  "internalLinkOpportunities": ["topic1","topic2"],
  "contentGuidelines": ["guideline1","guideline2"],
  "competitorInsights": "what top-ranking content does well"
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof seoBriefSchema>): string => `
Create a complete SEO content brief for:

TARGET KEYWORD: ${inputs.keyword}
TARGET AUDIENCE: ${inputs.targetAudience}
TARGET WORD COUNT: ${inputs.wordCount}
${inputs.competitorUrls?.length ? `COMPETITOR URLS TO BEAT:\n${inputs.competitorUrls.join('\n')}` : ''}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
