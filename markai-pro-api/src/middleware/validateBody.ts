import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { AppError, ErrorCodes } from '../utils/apiResponse'

export const validateBody = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return next(new AppError(400, ErrorCodes.VALIDATION_ERROR,
        'Validation failed',
        result.error.flatten().fieldErrors
      ))
    }
    req.body = result.data
    next()
  }

export const validateQuery = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return next(new AppError(400, ErrorCodes.VALIDATION_ERROR,
        'Invalid query parameters',
        result.error.flatten().fieldErrors
      ))
    }
    req.query = result.data as typeof req.query
    next()
  }
