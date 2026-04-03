import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from '../config/prisma'
import { env } from '../config/env'
import { Plan } from '@prisma/client'
import { AppError, ErrorCodes } from '../utils/apiResponse'

const SALT_ROUNDS = 12

export const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS)
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)

export const generateAccessToken = (userId: string, email: string, plan: Plan): string =>
  jwt.sign({ userId, email, plan }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'] })

export const generateRefreshToken = (): string => crypto.randomBytes(64).toString('hex')

export const storeRefreshToken = async (userId: string, token: string): Promise<void> => {
  const hash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({ data: { token: hash, userId, expiresAt } })
}

export const rotateRefreshToken = async (oldToken: string, userId: string): Promise<string> => {
  const oldHash = crypto.createHash('sha256').update(oldToken).digest('hex')
  const existing = await prisma.refreshToken.findUnique({ where: { token: oldHash } })

  if (!existing || existing.userId !== userId || existing.revokedAt || existing.expiresAt < new Date()) {
    throw new AppError(401, ErrorCodes.TOKEN_INVALID, 'Invalid refresh token')
  }

  await prisma.refreshToken.update({ where: { id: existing.id }, data: { revokedAt: new Date() } })

  const newToken = generateRefreshToken()
  await storeRefreshToken(userId, newToken)
  return newToken
}

export const revokeRefreshToken = async (token: string): Promise<void> => {
  const hash = crypto.createHash('sha256').update(token).digest('hex')
  await prisma.refreshToken.updateMany({
    where: { token: hash },
    data: { revokedAt: new Date() },
  })
}

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

export const generateEmailVerifyToken = (): string => crypto.randomBytes(32).toString('hex')

export const generatePasswordResetToken = (): { token: string; hash: string; exp: Date } => {
  const token = crypto.randomBytes(32).toString('hex')
  const hash = crypto.createHash('sha256').update(token).digest('hex')
  const exp = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  return { token, hash, exp }
}
