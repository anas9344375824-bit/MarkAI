import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import * as ctrl from '../controllers/billing.controller'

const router = Router()

router.get('/plans', asyncHandler(async (_req, res) => ctrl.getPlans(_req, res)))
router.use(requireAuth)
router.get('/subscription', asyncHandler(ctrl.getSubscription))
router.post('/checkout', asyncHandler(ctrl.createCheckout))
router.post('/portal', asyncHandler(ctrl.createPortal))
router.get('/invoices', asyncHandler(ctrl.getInvoices))
router.get('/usage', asyncHandler(ctrl.getUsage))

export default router
