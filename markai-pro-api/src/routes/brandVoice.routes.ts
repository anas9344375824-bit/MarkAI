import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import { requirePlan } from '../middleware/requirePlan'
import { creditCheck } from '../middleware/creditCheck'
import * as ctrl from '../controllers/brandVoice.controller'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(ctrl.getBrandVoice))
router.put('/', asyncHandler(ctrl.upsertBrandVoice))
router.post('/analyse-samples', requirePlan(['STARTER', 'PRO', 'AGENCY']), creditCheck('brand_voice_trainer'), asyncHandler(ctrl.analyseSamples))
router.post('/test', asyncHandler(ctrl.testBrandVoice))

export default router
