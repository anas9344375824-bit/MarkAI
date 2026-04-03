import { z } from 'zod'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe } from '../../../utils/helpers'

export const blogWriterSchema = z.object({
  topic: z.string().min(3).max(500),
  targetAudience: z.string().min(3).max(300),
  tone: z.enum(['Professional', 'Friendly', 'Authoritative', 'Conversational', 'Bold']),
  length: z.coerce.number().min(300).max(5000).default(1000),
  sections: z.array(z.string()).default(['Introduction', 'Conclusion']),
  keywords: z.array(z.string()).optional(),
  writingStyle: z.string().max(2000).optional(),
})

export type BlogWriterInputs = z.infer<typeof blogWriterSchema>

export const SYSTEM_PROMPT = `
You are an expert SEO content writer and digital marketing specialist with 10+ years of experience writing high-converting blog articles for leading brands.

Your articles are:
- Optimised for search intent (informational, transactional, or navigational as appropriate)
- Structured with clear H1, H2, H3 hierarchy
- Written in a natural, engaging tone that keeps readers scrolling
- Rich with specific examples, statistics, and actionable takeaways
- Never padded with fluff or generic filler sentences
- Always end with a clear, natural call to action

Output format: Return a JSON object with this exact shape:
{
  "title": "The exact H1 title (optimised for target keyword)",
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "SEO meta description (max 160 chars)",
  "outline": ["H2 heading 1", "H2 heading 2"],
  "body": "Full article in markdown format",
  "wordCount": number,
  "seoScore": number,
  "readingTime": "X min read",
  "primaryKeyword": "the main keyword targeted",
  "secondaryKeywords": ["kw1", "kw2"],
  "faqs": [{ "q": "question", "a": "answer" }]
}
Return ONLY the JSON. No preamble.
`.trim()

export const buildUserPrompt = (inputs: BlogWriterInputs, brandVoice?: BrandVoice | null): string => `
Write a complete, publish-ready blog article with the following specifications:

TOPIC / PRIMARY KEYWORD: ${inputs.topic}
TARGET AUDIENCE: ${inputs.targetAudience}
TONE: ${inputs.tone}
TARGET LENGTH: ${inputs.length} words (approximate)
INCLUDE SECTIONS: ${inputs.sections.join(', ')}
KEYWORDS TO INCLUDE: ${inputs.keywords?.join(', ') || 'none specified'}
${inputs.writingStyle ? `WRITING STYLE EXAMPLE:\n${inputs.writingStyle}\n` : ''}
${brandVoice?.systemPrompt ? `BRAND VOICE GUIDELINES:\n${brandVoice.systemPrompt}\n` : ''}

Write the full article now. Make it genuinely excellent.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<{
  title: string; metaTitle: string; metaDescription: string
  outline: string[]; body: string; wordCount: number
  seoScore: number; readingTime: string; primaryKeyword: string
  secondaryKeywords: string[]; faqs: { q: string; a: string }[]
}>(raw)
