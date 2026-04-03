import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/config/prisma'

const TEST_USER = { email: 'test@markaipro.com', password: 'TestPass123!', name: 'Test User' }
let accessToken: string
let refreshCookie: string

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } })
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_USER.email } })
  await prisma.$disconnect()
})

describe('POST /api/auth/register', () => {
  it('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER)
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.accessToken).toBeDefined()
    expect(res.body.data.user.email).toBe(TEST_USER.email)
    accessToken = res.body.data.accessToken
    refreshCookie = res.headers['set-cookie']?.[0] ?? ''
  })

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER)
    expect(res.status).toBe(409)
  })

  it('rejects invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...TEST_USER, email: 'not-an-email' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VAL_001')
  })

  it('rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...TEST_USER, email: 'other@test.com', password: '123' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  it('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: TEST_USER.email, password: TEST_USER.password })
    expect(res.status).toBe(200)
    expect(res.body.data.accessToken).toBeDefined()
    accessToken = res.body.data.accessToken
    refreshCookie = res.headers['set-cookie']?.[0] ?? ''
  })

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: TEST_USER.email, password: 'wrongpassword' })
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('AUTH_001')
  })

  it('rejects non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@test.com', password: 'password123' })
    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/refresh', () => {
  it('issues new access token with valid refresh cookie', async () => {
    const res = await request(app).post('/api/auth/refresh').set('Cookie', refreshCookie)
    expect(res.status).toBe(200)
    expect(res.body.data.accessToken).toBeDefined()
  })

  it('rejects request without refresh cookie', async () => {
    const res = await request(app).post('/api/auth/refresh')
    expect(res.status).toBe(401)
  })
})

describe('GET /api/auth/me', () => {
  it('returns current user with valid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${accessToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe(TEST_USER.email)
  })

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/logout', () => {
  it('clears refresh token cookie', async () => {
    const res = await request(app).post('/api/auth/logout').set('Cookie', refreshCookie)
    expect(res.status).toBe(200)
  })
})
