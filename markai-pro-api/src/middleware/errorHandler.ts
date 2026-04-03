import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/apiResponse'
import { env } from '../config/env'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    })
  }

  // Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; meta?: { target?: string[] } }
    if (prismaErr.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE', message: `${prismaErr.meta?.target?.join(', ')} already exists` },
      })
    }
    if (prismaErr.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Record not found' },
      })
    }
  }

  // Log unexpected errors
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err)

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    },
  })
}
