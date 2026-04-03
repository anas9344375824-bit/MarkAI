import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const reportGeneratorSchema = z.object({
  clientName: z.string(),
  period: z.string(),
  metrics: z.record(z.unknown()),
  brandColor: z.string().default('#6C47FF'),
  agencyName: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a marketing report writer who creates professional client-facing reports.

Output JSON:
{
  "reportTitle": "title",
  "executiveSummary": "2-3 paragraph summary",
  "highlights": [{ "metric": "", "value": "", "trend": "up|down|flat", "note": "" }],
  "sections": [
    { "title": "", "content": "", "metrics": [{ "name": "", "value": "", "change": "" }] }
  ],
  "recommendations": ["rec1","rec2","rec3"],
  "nextMonthFocus": ["focus1","focus2"]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof reportGeneratorSchema>): string => `
Create a professional marketing report for:

CLIENT: ${inputs.clientName}
PERIOD: ${inputs.period}
${inputs.agencyName ? `AGENCY: ${inputs.agencyName}` : ''}

METRICS DATA:
${JSON.stringify(inputs.metrics, null, 2)}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
