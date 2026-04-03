import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { success, paginated, AppError, ErrorCodes } from '../utils/apiResponse'
import { sendEmail, sendEmailToAddress } from '../services/email.service'

export const listContent = async (req: Request, res: Response) => {
  const { type, platform, status, campaignId, clientId, search, page = '1', limit = '20', sortBy = 'createdAt', sortDir = 'desc' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where = {
    userId: req.user!.id,
    archivedAt: null as null,
    ...(type ? { type: type as import('@prisma/client').ContentType } : {}),
    ...(platform ? { platform: platform as import('@prisma/client').Platform } : {}),
    ...(status ? { status: status as import('@prisma/client').ContentStatus } : {}),
    ...(campaignId ? { campaignId } : {}),
    ...(clientId ? { clientId } : {}),
    ...(search ? { title: { contains: search, mode: 'insensitive' as const } } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.content.findMany({
      where,
      orderBy: { [sortBy]: sortDir },
      skip,
      take: parseInt(limit),
      select: { id: true, title: true, type: true, platform: true, status: true, toolUsed: true, creditsUsed: true, createdAt: true, metadata: true },
    }),
    prisma.content.count({ where }),
  ])

  return paginated(res, items, total, parseInt(page), parseInt(limit))
}

export const getContent = async (req: Request, res: Response, next: NextFunction) => {
  const item = await prisma.content.findFirst({ where: { id: req.params.id, userId: req.user!.id } })
  if (!item) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Content not found'))
  return success(res, item)
}

export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  const item = await prisma.content.findFirst({ where: { id: req.params.id, userId: req.user!.id } })
  if (!item) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Content not found'))

  const updated = await prisma.content.update({
    where: { id: req.params.id },
    data: req.body,
  })
  return success(res, updated)
}

export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  const item = await prisma.content.findFirst({ where: { id: req.params.id, userId: req.user!.id } })
  if (!item) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Content not found'))

  await prisma.content.update({ where: { id: req.params.id }, data: { archivedAt: new Date() } })
  return success(res, { message: 'Content archived' })
}

export const sendForApproval = async (req: Request, res: Response, next: NextFunction) => {
  const { clientId, expiresInHours = 72 } = req.body
  const content = await prisma.content.findFirst({ where: { id: req.params.id, userId: req.user!.id } })
  if (!content) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Content not found'))

  const client = await prisma.client.findFirst({ where: { id: clientId } })
  if (!client) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Client not found'))

  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
  const link = await prisma.approvalLink.create({
    data: { clientId, contentId: content.id, expiresAt },
  })

  await prisma.content.update({ where: { id: content.id }, data: { status: 'PENDING_APPROVAL' } })

  if (client.contactEmail) {
    await sendEmailToAddress('contentApproval', client.contactEmail, {
      clientName: client.contactName ?? client.name,
      agencyName: req.user!.email,
      token: link.token,
    })
  }

  return success(res, { token: link.token, expiresAt })
}

export const getApprovalContent = async (req: Request, res: Response, next: NextFunction) => {
  const link = await prisma.approvalLink.findUnique({
    where: { token: req.params.token },
    include: { content: true, client: true },
  })

  if (!link || link.expiresAt < new Date()) {
    return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Approval link not found or expired'))
  }

  if (!link.viewedAt) {
    await prisma.approvalLink.update({ where: { id: link.id }, data: { viewedAt: new Date() } })
  }

  return success(res, { content: link.content, client: { name: link.client.name } })
}

export const respondToApproval = async (req: Request, res: Response, next: NextFunction) => {
  const { status, notes } = req.body
  const link = await prisma.approvalLink.findUnique({
    where: { token: req.params.token },
    include: { content: { include: { user: true } } },
  })

  if (!link || link.expiresAt < new Date()) {
    return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Approval link not found or expired'))
  }

  await prisma.approvalLink.update({
    where: { id: link.id },
    data: { status, notes, respondedAt: new Date() },
  })

  const newStatus = status === 'approved' ? 'APPROVED' : 'DRAFT'
  await prisma.content.update({ where: { id: link.contentId }, data: { status: newStatus } })

  await sendEmail('approvalReceived', link.content.userId, {
    status, notes, contentId: link.contentId,
  })

  await prisma.notification.create({
    data: {
      userId: link.content.userId,
      type: 'approval_response',
      title: `Client ${status === 'approved' ? 'approved' : 'requested changes on'} your content`,
      body: notes ?? '',
      link: `/content/${link.contentId}`,
    },
  })

  return success(res, { message: 'Response recorded' })
}
