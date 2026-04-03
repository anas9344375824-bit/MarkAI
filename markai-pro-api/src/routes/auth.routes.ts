import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { validateBody } from '../middleware/validateBody'
import { requireAuth } from '../middleware/auth'
import { strictRateLimit } from '../middleware/rateLimit'
import * as ctrl from '../controllers/auth.controller'
import { z } from 'zod'

const router = Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/register', strictRateLimit(10), validateBody(registerSchema), asyncHandler(ctrl.register))
router.post('/login', strictRateLimit(10), validateBody(loginSchema), asyncHandler(ctrl.login))
router.post('/refresh', asyncHandler(ctrl.refresh))
router.post('/logout', asyncHandler(ctrl.logout))
router.post('/forgot-password', strictRateLimit(3), validateBody(z.object({ email: z.string().email() })), asyncHandler(ctrl.forgotPassword))
router.post('/reset-password', validateBody(z.object({ token: z.string(), newPassword: z.string().min(8) })), asyncHandler(ctrl.resetPassword))
router.post('/verify-email', validateBody(z.object({ token: z.string() })), asyncHandler(ctrl.verifyEmail))
router.get('/me', requireAuth, asyncHandler(ctrl.getMe))

export default router
