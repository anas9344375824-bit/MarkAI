import { z } from 'zod'

export const technicalSeoSchema = z.object({
  website: z.string().url(),
  issues: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a Technical SEO expert. Audit websites and provide actionable fixes.
Output JSON:
{
  "seoScore": 0,
  "criticalIssues": [{ "issue": "", "impact": "High|Medium|Low", "fix": "" }],
  "robotsTxt": "",
  "xmlSitemap": "",
  "canonicalTagAdvice": "",
  "coreWebVitalsAdvice": { "lcp": "", "fid": "", "cls": "" },
  "crawlabilityIssues": [""],
  "priorityFixes": [{ "fix": "", "impact": "High|Medium|Low" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof technicalSeoSchema>): string => `
Website: ${inputs.website}
Known Issues: ${inputs.issues ?? 'none provided'}
Perform a full technical SEO audit and provide robots.txt, sitemap, and Core Web Vitals advice.
`.trim()
