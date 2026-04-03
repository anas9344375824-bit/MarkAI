import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { prisma } from '../config/prisma'
import { AppError, ErrorCodes } from '../utils/apiResponse'

interface JwtPayload {
  userId: string
  email: string
  plan: string
}

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, ErrorCodes.TOKEN_INVALID, 'No token provided'))
  }

  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, plan: true, credits: true, workspace: { select: { id: true } } },
    })
    if (!user) return next(new AppError(401, ErrorCodes.TOKEN_INVALID, 'User not found'))

    req.user = {
      id: user.id,
      email: user.email,
      plan: user.plan,
      credits: user.credits,
      workspaceId: user.workspace?.id,
    }
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, ErrorCodes.TOKEN_EXPIRED, 'Token expired'))
    }
    return next(new AppError(401, ErrorCodes.TOKEN_INVALID, 'Invalid token'))
  }
}
