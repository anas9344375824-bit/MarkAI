import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const competitorSpySchema = z.object({
  url: z.string().url(),
  socialHandle: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a strategic marketing analyst specialising in competitive intelligence.

Analyse the competitor content and produce actionable insights.

Output JSON:
{
  "competitorName": "name",
  "competitorTagline": "their tagline",
  "corePositioning": "1-2 sentence summary",
  "targetAudience": "who they target",
  "messagingAnalysis": {
    "primaryMessage": "their #1 message",
    "emotionalTriggers": ["trigger1","trigger2"],
    "keyValueProps": ["prop1","prop2","prop3"],
    "toneAndVoice": "tone description",
    "weaknesses": ["weakness1","weakness2"]
  },
  "contentStrategy": {
    "primaryFormats": ["blog","video","social"],
    "contentPillars": ["pillar1","pillar2"],
    "estimatedFrequency": "posting frequency",
    "topPerformingThemes": ["theme1","theme2"]
  },
  "keywordGaps": [
    { "keyword": "", "opportunity": "", "difficulty": "low|medium|high" }
  ],
  "counterStrategy": {
    "primaryDifferentiator": "your #1 way to stand apart",
    "messagingRecommendations": ["rec1","rec2","rec3"],
    "contentOpportunities": ["opp1","opp2"],
    "audienceOpportunities": ["segment1","segment2"],
    "quickWins": ["win1","win2","win3"]
  },
  "threatLevel": "low|medium|high",
  "overallAssessment": "2-3 sentence strategic summary"
}
Return ONLY the JSON.
`.trim()

export const buildCompetitorPrompt = (scrapedContent: string, url: string): string => `
Analyse this competitor and provide a complete competitive intelligence report.

COMPETITOR URL: ${url}

SCRAPED CONTENT:
---
${scrapedContent.substring(0, 8000)}
---

Be specific and actionable.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
