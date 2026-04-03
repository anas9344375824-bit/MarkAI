import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { TOOL_CREDITS } from '../types/ai.types'
import { AppError, ErrorCodes } from '../utils/apiResponse'

export const creditCheck = (toolSlug: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, ErrorCodes.TOKEN_INVALID, 'Not authenticated'))

    const cost = TOOL_CREDITS[toolSlug]
    if (cost === undefined) return next(new AppError(400, 'TOOL_NOT_FOUND', `Unknown tool: ${toolSlug}`))

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { credits: true },
    })
    if (!user) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'User not found'))

    if (user.credits < cost) {
      return next(new AppError(402, ErrorCodes.INSUFFICIENT_CREDITS,
        `You need ${cost} credits but only have ${user.credits} remaining.`,
        { required: cost, available: user.credits, upgrade: `${process.env.FRONTEND_URL}/billing` }
      ))
    }

    req.toolCreditCost = cost
    res.setHeader('X-Credits-Remaining', user.credits - cost)
    next()
  }

export const deductCredits = async (
  userId: string,
  cost: number,
  toolUsed: string,
  contentId?: string
): Promise<void> => {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: cost } },
    }),
    prisma.creditLog.create({
      data: { userId, amount: -cost, reason: 'tool_use', toolUsed, contentId },
    }),
  ])
}
