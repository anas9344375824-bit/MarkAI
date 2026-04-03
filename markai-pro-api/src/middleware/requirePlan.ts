import { Request, Response, NextFunction } from 'express'
import { Plan } from '@prisma/client'
import { AppError, ErrorCodes } from '../utils/apiResponse'
import { PLAN_FEATURES } from '../types/ai.types'

export const requirePlan = (plans: Plan[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError(401, ErrorCodes.TOKEN_INVALID, 'Not authenticated'))
  if (!plans.includes(req.user.plan)) {
    return next(new AppError(403, ErrorCodes.FEATURE_NOT_AVAILABLE,
      `This feature requires one of: ${plans.join(', ')}. You are on ${req.user.plan}.`,
      { currentPlan: req.user.plan, requiredPlans: plans, upgrade: `${process.env.FRONTEND_URL}/billing` }
    ))
  }
  next()
}

export const requireFeature = (feature: keyof typeof PLAN_FEATURES.FREE) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, ErrorCodes.TOKEN_INVALID, 'Not authenticated'))
    const features = PLAN_FEATURES[req.user.plan]
    if (!features[feature]) {
      return next(new AppError(403, ErrorCodes.FEATURE_NOT_AVAILABLE,
        `Feature "${feature}" is not available on your ${req.user.plan} plan.`,
        { upgrade: `${process.env.FRONTEND_URL}/billing` }
      ))
    }
    next()
  }
