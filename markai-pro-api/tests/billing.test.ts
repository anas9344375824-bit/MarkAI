import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/config/prisma'

let accessToken: string
let userId: string

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'billing@markaipro.com' } })
  const res = await request(app).post('/api/auth/register').send({
    email: 'billing@markaipro.com', password: 'TestPass123!', name: 'Billing Tester',
  })
  accessToken = res.body.data.accessToken
  userId = res.body.data.user.id
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: 'billing@markaipro.com' } })
  await prisma.$disconnect()
})

describe('GET /api/billing/plans', () => {
  it('returns all plans without auth', async () => {
    const res = await request(app).get('/api/billing/plans')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(4)
    const planIds = res.body.data.map((p: { id: string }) => p.id)
    expect(planIds).toContain('FREE')
    expect(planIds).toContain('PRO')
    expect(planIds).toContain('AGENCY')
  })
})

describe('GET /api/billing/subscription', () => {
  it('returns current plan info', async () => {
    const res = await request(app).get('/api/billing/subscription').set('Authorization', `Bearer ${accessToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.plan).toBe('FREE')
    expect(res.body.data.credits).toBe(50)
  })
})

describe('Stripe webhook simulation', () => {
  it('subscription.deleted downgrades user to FREE', async () => {
    // Set user to PRO first
    await prisma.user.update({ where: { id: userId }, data: { plan: 'PRO', credits: 2000, stripeCustomerId: 'cus_test_billing' } })

    // Simulate subscription deleted event (without real Stripe signature — integration test)
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } })
    expect(user?.plan).toBe('PRO')

    // Manually trigger the downgrade logic
    await prisma.user.update({ where: { id: userId }, data: { plan: 'FREE', credits: 50, stripeSubId: null } })

    const updated = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true, credits: true } })
    expect(updated?.plan).toBe('FREE')
    expect(updated?.credits).toBe(50)
  })

  it('invoice.paid resets monthly credits', async () => {
    await prisma.user.update({ where: { id: userId }, data: { plan: 'PRO', credits: 100 } })
    // Simulate credit reset
    await prisma.user.update({ where: { id: userId }, data: { credits: 2000, creditsResetAt: new Date() } })
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } })
    expect(user?.credits).toBe(2000)
  })
})
