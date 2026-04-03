import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/config/prisma'

let accessToken: string
let userId: string

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'tooltest@markaipro.com' } })
  const res = await request(app).post('/api/auth/register').send({
    email: 'tooltest@markaipro.com', password: 'TestPass123!', name: 'Tool Tester',
  })
  accessToken = res.body.data.accessToken
  userId = res.body.data.user.id
  // Give enough credits for testing
  await prisma.user.update({ where: { id: userId }, data: { credits: 1000 } })
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'tooltest@markaipro.com' } })
  await prisma.$disconnect()
})

describe('GET /api/tools', () => {
  it('returns tool list', async () => {
    const res = await request(app).get('/api/tools').set('Authorization', `Bearer ${accessToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('requires authentication', async () => {
    const res = await request(app).get('/api/tools')
    expect(res.status).toBe(401)
  })
})

describe('POST /api/tools/:slug/generate/sync', () => {
  it('generates blog content and deducts credits', async () => {
    const creditsBefore = (await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } }))!.credits

    const res = await request(app)
      .post('/api/tools/blog_writer/generate/sync')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ topic: 'AI marketing tools', targetAudience: 'marketers', tone: 'Professional', length: 500, sections: ['Introduction'] })

    expect(res.status).toBe(200)
    expect(res.body.data.content).toBeDefined()

    const creditsAfter = (await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } }))!.credits
    expect(creditsAfter).toBeLessThan(creditsBefore)
  })

  it('returns 402 when insufficient credits', async () => {
    await prisma.user.update({ where: { id: userId }, data: { credits: 0 } })

    const res = await request(app)
      .post('/api/tools/blog_writer/generate/sync')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ topic: 'test', targetAudience: 'test', tone: 'Professional', length: 500, sections: [] })

    expect(res.status).toBe(402)
    expect(res.body.error.code).toBe('CREDITS_001')

    await prisma.user.update({ where: { id: userId }, data: { credits: 1000 } })
  })

  it('returns 404 for unknown tool', async () => {
    const res = await request(app)
      .post('/api/tools/nonexistent_tool/generate/sync')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})

    expect(res.status).toBe(404)
  })
})

describe('GET /api/tools/history', () => {
  it('returns generation history', async () => {
    const res = await request(app).get('/api/tools/history').set('Authorization', `Bearer ${accessToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
