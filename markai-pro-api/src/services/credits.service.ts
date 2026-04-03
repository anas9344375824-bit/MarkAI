import { prisma } from '../config/prisma'
import { Plan } from '@prisma/client'
import { PLAN_CREDITS } from '../types/ai.types'

export const deductCredits = async (
  userId: string,
  amount: number,
  toolUsed: string,
  contentId?: string
): Promise<number> => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
      select: { credits: true },
    })
    await tx.creditLog.create({
      data: { userId, amount: -amount, reason: 'tool_use', toolUsed, contentId },
    })
    return user.credits
  })
  return result
}

export const addCredits = async (
  userId: string,
  amount: number,
  reason: string
): Promise<number> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
    select: { credits: true },
  })
  await prisma.creditLog.create({ data: { userId, amount, reason } })
  return user.credits
}

export const resetMonthlyCredits = async (userId: string, plan: Plan): Promise<void> => {
  const credits = PLAN_CREDITS[plan]
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits, creditsResetAt: new Date() },
    }),
    prisma.creditLog.create({
      data: { userId, amount: credits, reason: 'plan_reset' },
    }),
  ])
}

export const getCreditHistory = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit
  const [logs, total] = await Promise.all([
    prisma.creditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.creditLog.count({ where: { userId } }),
  ])
  return { logs, total }
}
