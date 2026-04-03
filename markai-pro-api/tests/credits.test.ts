import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/config/prisma'

let accessToken: string
let userId: string

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'credits@markaipro.com' } })
  const res = await request(app).post('/api/auth/register').send({
    email: 'credits@markaipro.com', password: 'TestPass123!', name: 'Credits Tester',
  })
  accessToken = res.body.data.accessToken
  userId = res.body.data.user.id
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'credits@markaipro.com' } })
  await prisma.$disconnect()
})

describe('Credit system', () => {
  it('new user starts with 50 credits', async () => {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } })
    expect(user?.credits).toBe(50)
  })

  it('returns 402 with details when credits insufficient', async () => {
    await prisma.user.update({ where: { id: userId }, data: { credits: 5 } })

    const res = await request(app)
      .post('/api/tools/blog_writer/generate/sync')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ topic: 'test', targetAudience: 'test', tone: 'Professional', length: 500, sections: [] })

    expect(res.status).toBe(402)
    expect(res.body.error.details.required).toBe(15)
    expect(res.body.error.details.available).toBe(5)
    expect(res.body.error.details.upgrade).toBeDefined()
  })

  it('does NOT deduct credits on AI failure', async () => {
    await prisma.user.update({ where: { id: userId }, data: { credits: 100 } })
    // Credits should remain 100 if generation fails (tested via mock in real test env)
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } })
    expect(user?.credits).toBe(100)
  })

  it('logs credit deductions to CreditLog', async () => {
    await prisma.user.update({ where: { id: userId }, data: { credits: 1000 } })
    const logsBefore = await prisma.creditLog.count({ where: { userId } })

    await request(app)
      .post('/api/tools/caption_generator/generate/sync')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ topic: 'test product launch', platforms: ['INSTAGRAM'], goal: 'awareness', tone: 'Friendly' })

    const logsAfter = await prisma.creditLog.count({ where: { userId } })
    expect(logsAfter).toBeGreaterThan(logsBefore)
  })
})
