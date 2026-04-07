import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import { rateLimit } from '../middleware/rateLimit'
import * as ctrl from '../controllers/seo.controller'

const router = Router()

router.use(requireAuth)

router.get('/start', asyncHandler(ctrl.getSeoStartMessage))
router.post('/chat', rateLimit, asyncHandler(ctrl.seoChat))

export default router
