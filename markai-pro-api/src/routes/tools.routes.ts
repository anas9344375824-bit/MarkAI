import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import { creditCheck } from '../middleware/creditCheck'
import { rateLimit } from '../middleware/rateLimit'
import * as ctrl from '../controllers/tools.controller'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(ctrl.listTools))
router.get('/history', asyncHandler(ctrl.getHistory))
router.post('/:toolSlug/generate', rateLimit, (req, _res, next) => {
  creditCheck(req.params.toolSlug)(req, _res, next)
}, asyncHandler(ctrl.generateStream))
router.post('/:toolSlug/generate/sync', rateLimit, (req, _res, next) => {
  creditCheck(req.params.toolSlug)(req, _res, next)
}, asyncHandler(ctrl.generateSync))

export default router
