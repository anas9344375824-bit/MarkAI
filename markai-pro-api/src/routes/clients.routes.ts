import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import { requirePlan } from '../middleware/requirePlan'
import * as ctrl from '../controllers/clients.controller'

const router = Router()
router.use(requireAuth, requirePlan(['AGENCY']))

router.get('/', asyncHandler(ctrl.listClients))
router.post('/', asyncHandler(ctrl.createClient))
router.get('/:id', asyncHandler(ctrl.getClient))
router.patch('/:id', asyncHandler(ctrl.updateClient))
router.delete('/:id', asyncHandler(ctrl.deleteClient))
router.get('/:id/content', asyncHandler(ctrl.getClientContent))

export default router
