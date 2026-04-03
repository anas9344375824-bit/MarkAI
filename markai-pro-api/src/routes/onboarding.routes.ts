import { Router, Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../config/prisma'
import { success } from '../utils/apiResponse'
import { addCredits } from '../services/credits.service'
import { sendEmail } from '../services/email.service'
import { generateBrandVoiceSystemPrompt } from '../services/ai/promptBuilder'
import { slugify } from '../utils/helpers'

const router = Router()
router.use(requireAuth)

router.post('/step/1', asyncHandler(async (req: Request, res: Response) => {
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { preferences: { role: req.body.role } },
  })
  return success(res, { step: 1, done: true })
}))

router.post('/step/2', asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { preferences: true } })
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { preferences: { ...(user?.preferences as object ?? {}), platforms: req.body.platforms } },
  })
  return success(res, { step: 2, done: true })
}))

router.post('/step/3', asyncHandler(async (req: Request, res: Response) => {
  const { brandName, industry, brandVoiceDescription } = req.body
  const userId = req.user!.id

  // Create workspace
  const slug = slugify(brandName ?? req.user!.email)
  await prisma.workspace.upsert({
    where: { ownerId: userId },
    create: { name: brandName ?? 'My Workspace', slug, ownerId: userId, industry },
    update: { name: brandName, industry },
  })

  // Create initial brand voice from description
  if (brandVoiceDescription) {
    const tempVoice = { formalCasual: 50, seriousPlayful: 50, reservedBold: 50, traditionalInno: 50, technicalSimple: 50, wordsToUse: [], wordsToAvoid: [] }
    const systemPrompt = `${generateBrandVoiceSystemPrompt(tempVoice as never)}\nAdditional voice notes: ${brandVoiceDescription}`
    await prisma.brandVoice.upsert({
      where: { userId },
      create: { userId, systemPrompt },
      update: { systemPrompt },
    })
  }

  return success(res, { step: 3, done: true })
}))

router.post('/complete', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id
  await prisma.user.update({ where: { id: userId }, data: { onboardingDone: true } })
  await addCredits(userId, 10, 'onboarding_bonus')
  await sendEmail('welcome', userId, {})

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, plan: true, credits: true, onboardingDone: true },
  })
  return success(res, user)
}))

export default router
