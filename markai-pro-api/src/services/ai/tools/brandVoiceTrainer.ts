import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const brandVoiceTrainerSchema = z.object({
  samples: z.array(z.string().min(50)).min(1).max(10),
  brandName: z.string().optional(),
  industry: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are a brand voice analyst who studies writing samples to extract the unique voice, tone, and style of a brand.

Analyse the provided writing samples and extract:
- Tone characteristics
- Vocabulary patterns (words they love, words they avoid)
- Sentence structure preferences
- Personality traits
- Recommended slider values (0-100 scale)

Output JSON:
{
  "voiceSummary": "2-3 sentence description of this brand's voice",
  "toneCharacteristics": ["characteristic1","characteristic2","characteristic3"],
  "vocabularyPatterns": {
    "wordsTheyLove": ["word1","word2","word3","word4","word5"],
    "wordsTheyAvoid": ["word1","word2","word3"],
    "phrasePatterns": ["pattern1","pattern2"]
  },
  "sentenceStyle": "description of sentence structure",
  "personalityTraits": ["trait1","trait2","trait3"],
  "sliderRecommendations": {
    "formalCasual": number,
    "seriousPlayful": number,
    "reservedBold": number,
    "traditionalInno": number,
    "technicalSimple": number
  },
  "systemPrompt": "A concise brand voice instruction paragraph for AI prompts",
  "exampleRewrite": "Rewrite this generic sentence in the brand's voice: 'We help businesses grow.'"
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof brandVoiceTrainerSchema>): string => `
Analyse these writing samples and extract the brand voice profile.

${inputs.brandName ? `BRAND NAME: ${inputs.brandName}` : ''}
${inputs.industry ? `INDUSTRY: ${inputs.industry}` : ''}

WRITING SAMPLES:
${inputs.samples.map((s, i) => `--- Sample ${i + 1} ---\n${s}`).join('\n\n')}
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<Record<string, unknown>>(raw)
