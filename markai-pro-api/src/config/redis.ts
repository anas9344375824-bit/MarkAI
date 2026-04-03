import Redis from 'ioredis'
import { env } from './env'

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableReadyCheck: false,
})

redis.on('error', (err) => {
  console.error('Redis error:', err.message)
})

redis.on('connect', () => {
  console.log('✅ Redis connected')
})
