import { Request, Response, NextFunction } from 'express'
import { CampaignStatus, Prisma } from '@prisma/client'
import { prisma } from '../config/prisma'
import { success, paginated, AppError, ErrorCodes } from '../utils/apiResponse'
import { generateCampaignPlan } from '../services/ai/tools/campaignBuilder'
import { deductCredits } from '../services/credits.service'
import { TOOL_CREDITS } from '../types/ai.types'

export const listCampaigns = async (req: Request, res: Response) => {
  const { status, clientId, page = '1', limit = '20' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const where: Prisma.CampaignWhereInput = {
    userId: req.user!.id,
    ...(status ? { status: status as CampaignStatus } : {}),
    ...(clientId ? { clientId } : {}),
  }
  const [items, total] = await Promise.all([
    prisma.campaign.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
    prisma.campaign.count({ where }),
  ])
  return paginated(res, items, total, parseInt(page), parseInt(limit))
}

export const createCampaign = async (req: Request, res: Response) => {
  const campaign = await prisma.campaign.create({
    data: {
      userId: req.user!.id,
      name: req.body.name,
      goal: req.body.goal,
      targetAudience: req.body.targetAudience,
      keyMessage: req.body.keyMessage,
      platforms: req.body.platforms ?? [],
      budget: req.body.budget,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      clientId: req.body.clientId,
    },
  })
  return success(res, campaign, undefined, 201)
}

export const getCampaign = async (req: Request, res: Response, next: NextFunction) => {
  const campaign = await prisma.campaign.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { content: { orderBy: { createdAt: 'desc' } } },
  })
  if (!campaign) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Campaign not found'))
  return success(res, campaign)
}

export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  const existing = await prisma.campaign.findFirst({ where: { id: req.params.id, userId: req.user!.id } })
  if (!existing) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Campaign not found'))
  const updated = await prisma.campaign.update({
    where: { id: req.params.id },
    data: {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.status ? { status: req.body.status as CampaignStatus } : {}),
      ...(req.body.goal ? { goal: req.body.goal } : {}),
    },
  })
  return success(res, updated)
}

export const deleteCampaign = async (req: Request, res: Response, next: NextFunction) => {
  const existing = await prisma.campaign.findFirst({ where: { id: req.params.id, userId: req.user!.id } })
  if (!existing) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Campaign not found'))
  await prisma.campaign.update({ where: { id: req.params.id }, data: { status: CampaignStatus.ARCHIVED } })
  return success(res, { message: 'Campaign archived' })
}

export const buildCampaign = async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.user!.id
  const cost = TOOL_CREDITS.campaign_builder

  const campaign = await prisma.campaign.create({
    data: {
      userId,
      name: req.body.name,
      goal: req.body.goal,
      targetAudience: req.body.targetAudience,
      keyMessage: req.body.keyMessage,
      platforms: req.body.platforms ?? [],
      budget: req.body.budget,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      status: CampaignStatus.PLANNING,
      brief: req.body as Prisma.InputJsonValue,
    },
  })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = (obj: object) => res.write(`data: ${JSON.stringify(obj)}\n\n`)

  try {
    send({ type: 'progress', message: 'Building campaign plan...', platform: null })

    const plan = await generateCampaignPlan(req.body)
    if (!plan) throw new Error('Failed to generate campaign plan')

    send({ type: 'progress', message: 'Campaign plan ready. Generating content...', platform: null })

    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { brief: plan as Prisma.InputJsonValue, status: CampaignStatus.ACTIVE },
    })

    await deductCredits(userId, cost, 'campaign_builder')
    send({ type: 'done', campaignId: campaign.id, plan, metadata: { creditsUsed: cost } })
  } catch (err) {
    send({ type: 'error', message: err instanceof Error ? err.message : 'Campaign generation failed' })
  } finally {
    res.end()
  }
}
