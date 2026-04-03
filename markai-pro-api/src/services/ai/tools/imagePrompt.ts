import { z } from 'zod'
import { parseJsonSafe } from '../../../utils/helpers'

export const imagePromptSchema = z.object({
  subject: z.string().min(3),
  style: z.enum(['photorealistic','illustration','3d-render','watercolor','minimalist','cinematic','anime']),
  mood: z.string().optional(),
  platform: z.enum(['INSTAGRAM','LINKEDIN','FACEBOOK','BLOG','ADS']).optional(),
  count: z.coerce.number().min(1).max(10).default(5),
})
export type ImagePromptInputs = z.infer<typeof imagePromptSchema>

export const SYSTEM_PROMPT = `
You are an expert AI image prompt engineer who creates prompts that produce stunning, on-brand visuals using Midjourney, DALL·E 3, and Stable Diffusion.

Output JSON:
{
  "prompts": [
    {
      "promptNumber": 1,
      "tool": "midjourney|dalle|stable-diffusion",
      "prompt": "full optimised prompt",
      "negativePrompt": "things to exclude (for SD)",
      "aspectRatio": "16:9|1:1|9:16|4:5",
      "style": "style description",
      "useCase": "where to use this image"
    }
  ]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: ImagePromptInputs): string => `
Create ${inputs.count} AI image prompts for:

SUBJECT: ${inputs.subject}
STYLE: ${inputs.style}
MOOD: ${inputs.mood || 'not specified'}
PLATFORM USE: ${inputs.platform || 'general'}

Generate prompts optimised for Midjourney, DALL·E 3, and Stable Diffusion.
`.trim()

export const parseOutput = (raw: string) => parseJsonSafe<{
  prompts: Array<{
    promptNumber: number; tool: string; prompt: string
    negativePrompt: string; aspectRatio: string; style: string; useCase: string
  }>
}>(raw)
