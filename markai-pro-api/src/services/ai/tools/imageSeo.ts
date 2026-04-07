import { z } from 'zod'

export const imageSeoSchema = z.object({
  imageDescription: z.string().min(2),
  targetKeyword: z.string().min(2),
  pageContext: z.string().optional(),
  imageCount: z.coerce.number().default(1),
})

export const SYSTEM_PROMPT = `
You are an Image SEO expert. Optimize images for search visibility and page speed.
Output JSON:
{
  "altTexts": [""],
  "fileNames": [""],
  "captions": [""],
  "compressionAdvice": "",
  "imageSitemapEntry": "",
  "surroundingTextAdvice": "",
  "lazyLoadingAdvice": "",
  "priorityActions": [{ "action": "", "impact": "High|Medium|Low" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof imageSeoSchema>): string => `
Image Description: ${inputs.imageDescription}
Target Keyword: ${inputs.targetKeyword}
Page Context: ${inputs.pageContext ?? 'not provided'}
Number of Images: ${inputs.imageCount}
Generate SEO-optimized alt texts, file names, captions, and compression advice.
`.trim()
