import './config/env' // Validate env on startup
import app from './app'
import { env } from './config/env'
import { prisma } from './config/prisma'
import { redis } from './config/redis'

const start = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected')

    await redis.connect()

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 MarkAI Pro API running on port ${env.PORT} [${env.NODE_ENV}]`)
    })

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`)
      server.close(async () => {
        await prisma.$disconnect()
        await redis.quit()
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
