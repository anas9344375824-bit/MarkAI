import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const analyticsNarratorSchema = z.object({
  data: z.string().min(10),
  reportType: z.enum(['executive-summary','campaign-report','channel-performance','monthly-review']),
  period: z.string().optional(),
  context: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a data analyst and marketing strategist who transforms raw marketing data into clear, compelling narratives.

You write reports that:
- Lead with the most important insight
- Use plain English, not jargon
- Contextualise numbers with benchmarks
- Highlight wins and concerns with equal candour
- End every section with a clear recommendation

Output JSON:
{
  "reportTitle": "generated title",
  "reportPeriod": "detected period",
  "executiveSummary": "3-4 sentence top-level summary",
  "keyHighlights": [
    { "metric": "", "value": "", "trend": "up|down|flat", "context": "", "significance": "high|medium|low" }
  ],
  "sections": [
    {
      "title": "section title",
      "narrative": "2-3 paragraph analysis",
      "keyMetrics": [{ "name": "", "value": "", "change": "+X%" }],
      "recommendation": "specific action to take"
    }
  ],
  "topRecommendations": ["rec1","rec2","rec3"],
  "redFlags": ["concern1","concern2"],
  "nextSteps": ["step1","step2","step3"]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof analyticsNarratorSchema>): string => `
Analyse this marketing data and write a ${inputs.reportType} report.

${inputs.period ? `REPORTING PERIOD: ${inputs.period}` : ''}
${inputs.context ? `ADDITIONAL CONTEXT: ${inputs.context}` : ''}

RAW DATA:
---
${inputs.data.substring(0, 8000)}
---
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
