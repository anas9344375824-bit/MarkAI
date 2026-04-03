import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import { requirePlan } from '../middleware/requirePlan'
import { creditCheck } from '../middleware/creditCheck'
import * as ctrl from '../controllers/competitors.controller'

const router = Router()
router.use(requireAuth, requirePlan(['PRO', 'AGENCY']))

router.get('/', asyncHandler(ctrl.listReports))
router.post('/analyse', creditCheck('competitor_spy'), asyncHandler(ctrl.analyseCompetitor))
router.get('/:id', asyncHandler(ctrl.getReport))
router.delete('/:id', asyncHandler(ctrl.deleteReport))

export default router
