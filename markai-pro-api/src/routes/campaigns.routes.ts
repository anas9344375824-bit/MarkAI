import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import { requirePlan } from '../middleware/requirePlan'
import { creditCheck } from '../middleware/creditCheck'
import * as ctrl from '../controllers/campaigns.controller'

const router = Router()
router.use(requireAuth)

router.get('/', asyncHandler(ctrl.listCampaigns))
router.post('/', asyncHandler(ctrl.createCampaign))
router.post('/build', requirePlan(['PRO', 'AGENCY']), creditCheck('campaign_builder'), asyncHandler(ctrl.buildCampaign))
router.get('/:id', asyncHandler(ctrl.getCampaign))
router.patch('/:id', asyncHandler(ctrl.updateCampaign))
router.delete('/:id', asyncHandler(ctrl.deleteCampaign))

export default router
