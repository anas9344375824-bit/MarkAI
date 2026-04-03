import { z } from 'zod'
import { Platform } from '@prisma/client'
import { BrandVoice } from '@prisma/client'
import { parseJsonSafe, runWithConcurrency } from '../../../utils/helpers'
import { generateCompletion } from '../aiRouter'
import { buildFinalPrompt } from '../promptBuilder'

export const campaignBuilderSchema = z.object({
  name: z.string().min(3),
  goal: z.string().min(3),
  targetAudience: z.string().min(3),
  keyMessage: z.string().min(10),
  platforms: z.array(z.nativeEnum(Platform)).min(1),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type CampaignBrief = z.infer<typeof campaignBuilderSchema>

export const ORCHESTRATION_SYSTEM = `
You are a senior marketing strategist. Given a campaign brief, create a detailed content plan specifying exactly what content to create for each platform.

Output JSON:
{
  "campaignTheme": "overarching creative theme",
  "coreNarrative": "the story arc across all platforms",
  "platforms": {
    "INSTAGRAM": {
      "strategy": "platform-specific approach",
      "contentItems": [
        { "type": "SOCIAL_CAPTION", "topic": "specific topic", "purpose": "awareness|engagement|conversion" }
      ]
    }
  },
  "totalPieces": number,
  "launchSequence": ["what goes first, second, third"],
  "kpis": ["metric1 to track","metric2"]
}
Return ONLY the JSON.
`.trim()

export const buildOrchestrationPrompt = (brief: CampaignBrief): string => `
Create a content plan for this campaign:

Name: ${brief.name}
Goal: ${brief.goal}
Target Audience: ${brief.targetAudience}
Key Message: ${brief.keyMessage}
Platforms: ${brief.platforms.join(', ')}
Timeline: ${brief.startDate || 'TBD'} to ${brief.endDate || 'TBD'}
Budget: ${brief.budget || 'not specified'}
`.trim()

export const generateCampaignPlan = async (brief: CampaignBrief): Promise<Record<string, unknown> | null> => {
  const { system, user } = buildFinalPrompt(ORCHESTRATION_SYSTEM, buildOrchestrationPrompt(brief), null)
  const result = await generateCompletion(system, user, { jsonMode: true })
  return parseJsonSafe<Record<string, unknown>>(result.content)
}

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
