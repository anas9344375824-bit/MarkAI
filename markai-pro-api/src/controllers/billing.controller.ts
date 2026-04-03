import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { success, AppError, ErrorCodes } from '../utils/apiResponse'
import { createCheckoutSession, createPortalSession } from '../services/stripe.service'

export const getPlans = (_req: Request, res: Response) => {
  return success(res, [
    { id: 'FREE', name: 'Free', price: { monthly: 0, annual: 0 }, credits: 50, features: ['5 tools', '50 credits/mo'] },
    { id: 'STARTER', name: 'Starter', price: { monthly: 19, annual: 15 }, credits: 500, features: ['All basic tools', '500 credits/mo', 'Brand voice', 'Content calendar'] },
    { id: 'PRO', name: 'Pro', price: { monthly: 49, annual: 39 }, credits: 2000, features: ['All 26 tools', '2000 credits/mo', 'Campaign builder', 'Competitor spy'] },
    { id: 'AGENCY', name: 'Agency', price: { monthly: 99, annual: 79 }, credits: 10000, features: ['Everything in Pro', '10000 credits/mo', 'Client workspaces', 'White-label reports', 'Team members'] },
  ])
}

export const getSubscription = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { plan: true, credits: true, creditsResetAt: true, stripeSubId: true },
  })
  return success(res, user)
}

export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {
  const { plan, interval } = req.body
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { email: true, name: true } })
  if (!user) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'User not found'))

  const url = await createCheckoutSession(req.user!.id, user.email, user.name, plan, interval)
  return success(res, { checkoutUrl: url })
}

export const createPortal = async (req: Request, res: Response, next: NextFunction) => {
  const url = await createPortalSession(req.user!.id)
  return success(res, { portalUrl: url })
}

export const getInvoices = async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const [items, total] = await Promise.all([
    prisma.invoice.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
    prisma.invoice.count({ where: { userId: req.user!.id } }),
  ])
  return success(res, items, { page: parseInt(page), limit: parseInt(limit), total })
}

export const getUsage = async (req: Request, res: Response) => {
  const userId = req.user!.id
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [creditLogs, usageLogs, contentCount] = await Promise.all([
    prisma.creditLog.findMany({ where: { userId, createdAt: { gte: startOfMonth }, amount: { lt: 0 } } }),
    prisma.usageLog.findMany({ where: { userId, createdAt: { gte: startOfMonth } } }),
    prisma.content.count({ where: { userId, createdAt: { gte: startOfMonth } } }),
  ])

  const creditsUsed = creditLogs.reduce((sum, l) => sum + Math.abs(l.amount), 0)
  const toolBreakdown = usageLogs.reduce((acc, l) => {
    acc[l.toolName] = (acc[l.toolName] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return success(res, { creditsUsed, contentCreated: contentCount, toolBreakdown })
}
