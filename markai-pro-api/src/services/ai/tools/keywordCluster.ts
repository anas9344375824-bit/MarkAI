import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const keywordClusterSchema = z.object({
  topic: z.string().min(3),
  industry: z.string().optional(),
  targetCountry: z.string().default('US'),
  clusterCount: z.coerce.number().min(3).max(20).default(8),
})

export const SYSTEM_PROMPT = `
You are an SEO strategist who creates comprehensive keyword cluster maps for content planning.

For each cluster, provide:
- Pillar keyword (high volume, competitive)
- Supporting keywords (medium volume, easier to rank)
- Long-tail keywords (low volume, high intent)
- Search intent classification

Output JSON:
{
  "topic": "main topic",
  "clusters": [
    {
      "clusterName": "cluster name",
      "pillarKeyword": { "keyword": "", "estimatedVolume": "X/mo", "difficulty": "low|medium|high", "intent": "informational|navigational|transactional|commercial" },
      "supportingKeywords": [{ "keyword": "", "estimatedVolume": "", "intent": "" }],
      "longTailKeywords": [{ "keyword": "", "estimatedVolume": "", "intent": "" }],
      "contentIdea": "suggested article title for this cluster"
    }
  ],
  "contentStrategy": "overall recommendation",
  "priorityOrder": ["cluster1","cluster2"]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof keywordClusterSchema>): string => `
Create a keyword cluster map for:

TOPIC: ${inputs.topic}
INDUSTRY: ${inputs.industry || 'general'}
TARGET MARKET: ${inputs.targetCountry}
NUMBER OF CLUSTERS: ${inputs.clusterCount}

Group keywords by topic cluster and search intent.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
