import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma'
import { success, AppError } from '../utils/apiResponse'
import { generateCompletion } from '../services/ai/aiRouter'
import { buildFinalPrompt, generateBrandVoiceSystemPrompt } from '../services/ai/promptBuilder'
import { deductCredits } from '../services/credits.service'
import { TOOL_CREDITS } from '../types/ai.types'
import { parseJsonSafe } from '../utils/helpers'
import * as bvTrainer from '../services/ai/tools/brandVoiceTrainer'

export const getBrandVoice = async (req: Request, res: Response) => {
  const bv = await prisma.brandVoice.findUnique({ where: { userId: req.user!.id } })
  return success(res, bv)
}

export const upsertBrandVoice = async (req: Request, res: Response) => {
  const userId = req.user!.id
  const data = req.body
  const tempVoice = { ...data, wordsToUse: data.wordsToUse ?? [], wordsToAvoid: data.wordsToAvoid ?? [] }
  const systemPrompt = generateBrandVoiceSystemPrompt(tempVoice as never)
  const bv = await prisma.brandVoice.upsert({
    where: { userId },
    create: { userId, ...data, systemPrompt },
    update: { ...data, systemPrompt },
  })
  return success(res, bv)
}

export const analyseSamples = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.id
  const cost = TOOL_CREDITS.brand_voice_trainer

  const { system, user: userPrompt } = buildFinalPrompt(
    bvTrainer.SYSTEM_PROMPT,
    bvTrainer.buildUserPrompt(req.body),
    null
  )

  const result = await generateCompletion(system, userPrompt, { jsonMode: true })
  const parsed = parseJsonSafe<Record<string, unknown>>(result.content)
  if (!parsed) return next(new AppError(500, 'AI_001', 'Failed to parse brand voice analysis'))

  const sliders = parsed.sliderRecommendations as Record<string, number> | undefined
  const vocab = parsed.vocabularyPatterns as { wordsTheyLove?: string[]; wordsTheyAvoid?: string[] } | undefined
  const voiceProfile = parsed as Prisma.InputJsonValue
  const systemPrompt = (parsed.systemPrompt as string) ?? ''

  const upsertData = {
    formalCasual: sliders?.formalCasual ?? 50,
    seriousPlayful: sliders?.seriousPlayful ?? 50,
    reservedBold: sliders?.reservedBold ?? 50,
    traditionalInno: sliders?.traditionalInno ?? 50,
    technicalSimple: sliders?.technicalSimple ?? 50,
    wordsToUse: vocab?.wordsTheyLove ?? [],
    wordsToAvoid: vocab?.wordsTheyAvoid ?? [],
    voiceProfile,
    systemPrompt,
  }

  await prisma.brandVoice.upsert({
    where: { userId },
    create: { userId, ...upsertData },
    update: upsertData,
  })

  await deductCredits(userId, cost, 'brand_voice_trainer')
  return success(res, { analysis: parsed, creditsUsed: cost })
}

export const testBrandVoice = async (req: Request, res: Response) => {
  const userId = req.user!.id
  const { topic } = req.body
  const brandVoice = await prisma.brandVoice.findUnique({ where: { userId } })
  const testPrompt = `Write a short Instagram caption (2-3 sentences) about: ${topic}`

  const [standard, branded] = await Promise.all([
    generateCompletion('You are a social media copywriter.', testPrompt),
    generateCompletion(
      buildFinalPrompt('You are a social media copywriter.', testPrompt, brandVoice).system,
      testPrompt
    ),
  ])

  return success(res, { standard: standard.content, branded: branded.content })
}
