import { Router, Request, Response, NextFunction } from 'express'
import { handleWebhook } from '../services/stripe.service'
import { AppError } from '../utils/apiResponse'

const router = Router()

router.post('/stripe', async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'] as string
  if (!sig) return next(new AppError(400, 'MISSING_SIGNATURE', 'Missing Stripe signature'))

  try {
    await handleWebhook(req.body as Buffer, sig)
    res.json({ received: true })
  } catch (err) {
    next(err)
  }
})

export default router
