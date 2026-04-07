import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'

import authRoutes from './routes/auth.routes'
import toolsRoutes from './routes/tools.routes'
import campaignsRoutes from './routes/campaigns.routes'
import contentRoutes from './routes/content.routes'
import brandVoiceRoutes from './routes/brandVoice.routes'
import competitorsRoutes from './routes/competitors.routes'
import clientsRoutes from './routes/clients.routes'
import billingRoutes from './routes/billing.routes'
import webhookRoutes from './routes/webhooks.routes'
import onboardingRoutes from './routes/onboarding.routes'
import seoRoutes from './routes/seo.routes'

const app = express()

// Security
app.use(helmet())
app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

// Stripe webhook needs raw body — must be before json parser
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Logging
if (env.NODE_ENV !== 'test') app.use(morgan('dev'))

// Health check
app.get('/api/health', async (_req, res) => {
  const { prisma } = await import('./config/prisma')
  const { redis } = await import('./config/redis')
  let dbStatus = 'connected'
  let redisStatus = 'connected'

  try { await prisma.$queryRaw`SELECT 1` } catch { dbStatus = 'error' }
  try { await redis.ping() } catch { redisStatus = 'error' }

  res.json({ status: 'ok', version: '1.0.0', db: dbStatus, redis: redisStatus, timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tools', toolsRoutes)
app.use('/api/campaigns', campaignsRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/brand-voice', brandVoiceRoutes)
app.use('/api/competitors', competitorsRoutes)
app.use('/api/clients', clientsRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/onboarding', onboardingRoutes)
app.use('/api/seo', seoRoutes)

// 404
app.use((_req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }))

// Global error handler
app.use(errorHandler)

export default app
