import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const metaTagSchema = z.object({
  pageTitle: z.string().min(3),
  pageContent: z.string().min(10),
  targetKeyword: z.string().min(2),
  pageType: z.enum(['homepage','blog-post','product','category','landing-page']),
})

export const SYSTEM_PROMPT = `
You are an SEO specialist who writes meta tags that maximise click-through rates from search results.

Output JSON:
{
  "metaTitle": "optimised title (max 60 chars, includes keyword near start)",
  "metaDescription": "compelling description (max 160 chars, includes keyword, has CTA)",
  "ogTitle": "Open Graph title for social sharing",
  "ogDescription": "OG description for social sharing",
  "twitterTitle": "Twitter card title",
  "twitterDescription": "Twitter card description",
  "canonicalUrl": "{{PAGE_URL}} placeholder",
  "schemaType": "Article|Product|WebPage|FAQPage",
  "titleScore": number,
  "descriptionScore": number,
  "improvements": ["suggestion1","suggestion2"]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof metaTagSchema>): string => `
Write optimised meta tags for:

PAGE TITLE: ${inputs.pageTitle}
TARGET KEYWORD: ${inputs.targetKeyword}
PAGE TYPE: ${inputs.pageType}
PAGE CONTENT SUMMARY: ${inputs.pageContent.substring(0, 500)}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
