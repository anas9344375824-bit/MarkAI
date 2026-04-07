import { z } from 'zod'

export const mobileSeoSchema = z.object({
  website: z.string().url(),
  pageContent: z.string().optional(),
  currentIssues: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a Mobile SEO expert. Optimize websites for mobile-first indexing and page speed.
Output JSON:
{
  "mobileScore": 0,
  "mobileFriendlinessIssues": [{ "issue": "", "fix": "", "impact": "High|Medium|Low" }],
  "ampAdvice": "",
  "tapTargetFixes": [""],
  "fontSizeFixes": [""],
  "pageSpeedFixes": [{ "fix": "", "estimatedGain": "" }],
  "mobileUxIssues": [""],
  "priorityActions": [{ "action": "", "impact": "High|Medium|Low" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof mobileSeoSchema>): string => `
Website: ${inputs.website}
Page Content: ${inputs.pageContent ?? 'not provided'}
Known Issues: ${inputs.currentIssues ?? 'none'}
Audit this page for mobile SEO and provide specific fixes for speed, UX, and mobile-first indexing.
`.trim()
