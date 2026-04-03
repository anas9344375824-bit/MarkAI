import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { requireAuth } from '../middleware/auth'
import * as ctrl from '../controllers/content.controller'

const router = Router()

// Public approval routes
router.get('/approve/:token', asyncHandler(ctrl.getApprovalContent))
router.post('/approve/:token', asyncHandler(ctrl.respondToApproval))

// Protected routes
router.use(requireAuth)
router.get('/', asyncHandler(ctrl.listContent))
router.get('/:id', asyncHandler(ctrl.getContent))
router.patch('/:id', asyncHandler(ctrl.updateContent))
router.delete('/:id', asyncHandler(ctrl.deleteContent))
router.post('/:id/send-approval', asyncHandler(ctrl.sendForApproval))

export default router
