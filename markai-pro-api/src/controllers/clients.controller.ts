import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { success, paginated, AppError, ErrorCodes } from '../utils/apiResponse'
import { slugify } from '../utils/helpers'

export const listClients = async (req: Request, res: Response) => {
  const workspace = await prisma.workspace.findUnique({ where: { ownerId: req.user!.id } })
  if (!workspace) return success(res, [])

  const { page = '1', limit = '20' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const [items, total] = await Promise.all([
    prisma.client.findMany({ where: { workspaceId: workspace.id }, orderBy: { name: 'asc' }, skip, take: parseInt(limit) }),
    prisma.client.count({ where: { workspaceId: workspace.id } }),
  ])
  return paginated(res, items, total, parseInt(page), parseInt(limit))
}

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  let workspace = await prisma.workspace.findUnique({ where: { ownerId: req.user!.id } })
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: `${req.user!.email}'s Workspace`, slug: slugify(req.user!.email), ownerId: req.user!.id },
    })
  }

  const slug = slugify(req.body.name)
  const client = await prisma.client.create({
    data: { ...req.body, workspaceId: workspace.id, slug },
  })
  return success(res, client, undefined, 201)
}

export const getClient = async (req: Request, res: Response, next: NextFunction) => {
  const workspace = await prisma.workspace.findUnique({ where: { ownerId: req.user!.id } })
  if (!workspace) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Client not found'))

  const client = await prisma.client.findFirst({
    where: { id: req.params.id, workspaceId: workspace.id },
    include: {
      campaigns: { orderBy: { createdAt: 'desc' }, take: 5 },
      brandVoice: true,
      _count: { select: { content: true, approvalLinks: { where: { status: 'pending' } } } },
    },
  })
  if (!client) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Client not found'))
  return success(res, client)
}

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  const workspace = await prisma.workspace.findUnique({ where: { ownerId: req.user!.id } })
  if (!workspace) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Client not found'))

  const client = await prisma.client.findFirst({ where: { id: req.params.id, workspaceId: workspace.id } })
  if (!client) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Client not found'))

  const updated = await prisma.client.update({ where: { id: req.params.id }, data: req.body })
  return success(res, updated)
}

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  const workspace = await prisma.workspace.findUnique({ where: { ownerId: req.user!.id } })
  if (!workspace) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Client not found'))

  const client = await prisma.client.findFirst({ where: { id: req.params.id, workspaceId: workspace.id } })
  if (!client) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Client not found'))

  await prisma.client.update({ where: { id: req.params.id }, data: { isActive: false } })
  return success(res, { message: 'Client deactivated' })
}

export const getClientContent = async (req: Request, res: Response, next: NextFunction) => {
  const workspace = await prisma.workspace.findUnique({ where: { ownerId: req.user!.id } })
  if (!workspace) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Client not found'))

  const { status, type, page = '1', limit = '20' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where: import('@prisma/client').Prisma.ContentWhereInput = {
    clientId: req.params.id,
    ...(status ? { status: status as import('@prisma/client').ContentStatus } : {}),
    ...(type ? { type: type as import('@prisma/client').ContentType } : {}),
    archivedAt: null,
  }

  const [items, total] = await Promise.all([
    prisma.content.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
    prisma.content.count({ where }),
  ])
  return paginated(res, items, total, parseInt(page), parseInt(limit))
}
