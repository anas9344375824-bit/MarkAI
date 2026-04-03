import { Request, Response, NextFunction } from 'express'
import { redis } from '../config/redis'
import { env } from '../config/env'
import { Plan } from '@prisma/client'
import { AppError, ErrorCodes } from '../utils/apiResponse'

const LIMITS: Record<Plan, number> = {
  FREE: env.RATE_LIMIT_MAX_FREE,
  STARTER: env.RATE_LIMIT_MAX_STARTER,
  PRO: env.RATE_LIMIT_MAX_PRO,
  AGENCY: env.RATE_LIMIT_MAX_AGENCY,
}

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  const identifier = req.user ? `rl:user:${req.user.id}` : `rl:ip:${req.ip}`
  const limit = req.user ? LIMITS[req.user.plan] : 10
  const window = Math.floor(env.RATE_LIMIT_WINDOW_MS / 1000)

  try {
    const key = `${identifier}:${Math.floor(Date.now() / env.RATE_LIMIT_WINDOW_MS)}`
    const current = await redis.incr(key)
    if (current === 1) await redis.expire(key, window)

    res.setHeader('X-RateLimit-Limit', limit)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current))

    if (current > limit) {
      return next(new AppError(429, ErrorCodes.RATE_LIMIT_EXCEEDED,
        `Rate limit exceeded. Max ${limit} requests per minute.`
      ))
    }
    next()
  } catch {
    // Redis failure — fail open (don't block requests)
    next()
  }
}

export const strictRateLimit = (maxPerMinute: number) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const key = `rl:strict:${req.ip}:${Math.floor(Date.now() / 60000)}`
    try {
      const current = await redis.incr(key)
      if (current === 1) await redis.expire(key, 60)
      if (current > maxPerMinute) {
        return next(new AppError(429, ErrorCodes.RATE_LIMIT_EXCEEDED,
          `Too many requests. Please wait before trying again.`
        ))
      }
      next()
    } catch {
      next()
    }
  }
