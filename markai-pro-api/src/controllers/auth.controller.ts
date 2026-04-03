import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { env } from '../config/env'
import {
  hashPassword, verifyPassword, generateAccessToken, generateRefreshToken,
  storeRefreshToken, rotateRefreshToken, revokeRefreshToken, revokeAllUserTokens,
  generateEmailVerifyToken, generatePasswordResetToken,
} from '../services/auth.service'
import { sendEmail } from '../services/email.service'
import { success, AppError, ErrorCodes } from '../utils/apiResponse'
import crypto from 'crypto'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return next(new AppError(409, 'DUPLICATE', 'Email already registered'))

  const passwordHash = await hashPassword(password)
  const verifyToken = generateEmailVerifyToken()

  const user = await prisma.user.create({
    data: {
      email, passwordHash, name,
      emailVerifyToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
    },
    select: { id: true, email: true, name: true, plan: true, credits: true },
  })

  const accessToken = generateAccessToken(user.id, user.email, user.plan)
  const refreshToken = generateRefreshToken()
  await storeRefreshToken(user.id, refreshToken)

  await sendEmail('welcome', user.id, { name: user.name })

  res.cookie('refreshToken', refreshToken, COOKIE_OPTS)
  return success(res, { user, accessToken }, undefined, 201)
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, plan: true, credits: true, passwordHash: true },
  })

  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return next(new AppError(401, ErrorCodes.INVALID_CREDENTIALS, 'Invalid email or password'))
  }

  const accessToken = generateAccessToken(user.id, user.email, user.plan)
  const refreshToken = generateRefreshToken()
  await storeRefreshToken(user.id, refreshToken)

  const { passwordHash: _, ...safeUser } = user
  res.cookie('refreshToken', refreshToken, COOKIE_OPTS)
  return success(res, { user: safeUser, accessToken })
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.refreshToken
  if (!token) return next(new AppError(401, ErrorCodes.TOKEN_INVALID, 'No refresh token'))

  const user = await prisma.user.findFirst({
    where: { refreshTokens: { some: {} } },
    select: { id: true, email: true, plan: true },
  })

  // Find the token directly
  const hash = crypto.createHash('sha256').update(token).digest('hex')
  const stored = await prisma.refreshToken.findUnique({
    where: { token: hash },
    include: { user: { select: { id: true, email: true, plan: true } } },
  })

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    return next(new AppError(401, ErrorCodes.TOKEN_INVALID, 'Invalid or expired refresh token'))
  }

  const newRefreshToken = await rotateRefreshToken(token, stored.userId)
  const accessToken = generateAccessToken(stored.user.id, stored.user.email, stored.user.plan)

  res.cookie('refreshToken', newRefreshToken, COOKIE_OPTS)
  return success(res, { accessToken })
}

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken
  if (token) await revokeRefreshToken(token)
  res.clearCookie('refreshToken')
  return success(res, { message: 'Logged out' })
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  const user = await prisma.user.findUnique({ where: { email } })

  // Always return success to prevent email enumeration
  if (user) {
    const { token, hash, exp } = generatePasswordResetToken()
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: hash, passwordResetExp: exp },
    })
    await sendEmail('passwordReset', user.id, { token })
  }

  return success(res, { message: 'If that email exists, a reset link has been sent.' })
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token, newPassword } = req.body
  const hash = crypto.createHash('sha256').update(token).digest('hex')

  const user = await prisma.user.findFirst({
    where: { passwordResetToken: hash, passwordResetExp: { gt: new Date() } },
  })
  if (!user) return next(new AppError(400, 'TOKEN_INVALID', 'Invalid or expired reset token'))

  const passwordHash = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordResetToken: null, passwordResetExp: null },
  })
  await revokeAllUserTokens(user.id)

  return success(res, { message: 'Password reset successfully' })
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body
  const hash = crypto.createHash('sha256').update(token).digest('hex')

  const user = await prisma.user.findFirst({ where: { emailVerifyToken: hash } })
  if (!user) return next(new AppError(400, 'TOKEN_INVALID', 'Invalid verification token'))

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifyToken: null },
  })

  return success(res, { message: 'Email verified' })
}

export const getMe = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, email: true, name: true, avatarUrl: true, plan: true,
      credits: true, onboardingDone: true, timezone: true, createdAt: true,
      workspace: { select: { id: true, name: true, slug: true } },
      brandVoice: { select: { id: true, systemPrompt: true } },
    },
  })
  return success(res, user)
}
