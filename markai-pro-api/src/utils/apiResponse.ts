import { Response } from 'express'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const success = (res: Response, data: unknown, meta?: unknown, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  })
}

export const paginated = (
  res: Response,
  data: unknown[],
  total: number,
  page: number,
  limit: number
) => {
  return res.status(200).json({
    success: true,
    data,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

// Error codes reference
export const ErrorCodes = {
  INVALID_CREDENTIALS: 'AUTH_001',
  TOKEN_EXPIRED: 'AUTH_002',
  TOKEN_INVALID: 'AUTH_003',
  EMAIL_NOT_VERIFIED: 'AUTH_004',
  INSUFFICIENT_CREDITS: 'CREDITS_001',
  PLAN_LIMIT_REACHED: 'CREDITS_002',
  FEATURE_NOT_AVAILABLE: 'PLAN_001',
  AI_PROVIDER_ERROR: 'AI_001',
  AI_TIMEOUT: 'AI_002',
  CONTENT_POLICY: 'AI_003',
  RATE_LIMIT_EXCEEDED: 'RATE_001',
  VALIDATION_ERROR: 'VAL_001',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
} as const
