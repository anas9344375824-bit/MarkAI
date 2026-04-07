import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { openrouter } from '../config/openrouter'
import { deductCredits } from '../services/credits.service'
import { success, AppError, ErrorCodes } from '../utils/apiResponse'
import { SEO_SYSTEM_PROMPT, SEO_START_MESSAGE } from '../prompts/seo.prompt'

const SEO_MODEL = 'google/gemma-3-27b-it:free'
const SEO_CREDIT_COST = 5

const HARAM_KEYWORDS = [
  'gambling', 'betting', 'casino', 'poker', 'slot',
  'adult', 'porn', 'xxx', 'escort',
  'alcohol', 'liquor', 'beer', 'wine',
  'drugs', 'weed', 'cocaine',
  'riba', 'interest fraud', 'scam', 'phishing',
]

const isHaramRequest = (message: string): boolean => {
  const lower = message.toLowerCase()
  return HARAM_KEYWORDS.some(kw => lower.includes(kw))
}

// GET /api/seo/start — returns welcome message
export const getSeoStartMessage = async (_req: Request, res: Response): Promise<void> => {
  success(res, { message: SEO_START_MESSAGE })
}

// POST /api/seo/chat — main SEO chat with history
export const seoChat = async (req: Request, res: Response, next: NextFunction) => {
  const { message, history = [], url, keyword } = req.body

  if (!message) return next(new AppError(400, ErrorCodes.VALIDATION_ERROR, 'Message is required'))

  // Haram filter
  if (isHaramRequest(message)) {
    return success(res, {
      blocked: true,
      response: '⛔ Sorry, MarkAI Pro only supports halal businesses. This request cannot be processed.',
    })
  }

  const userId = req.user!.id

  // Build user message with optional URL and keyword context
  const userContent = [
    url ? `URL: ${url}` : null,
    keyword ? `TARGET KEYWORD: ${keyword}` : null,
    `USER REQUEST: ${message}`,
  ].filter(Boolean).join('\n')

  // Build messages with conversation history
  const messages = [
    ...history.map((h: { role: string; content: string }) => ({
      role: h.role,
      content: h.content,
    })),
    { role: 'user', content: userContent },
  ]

  try {
    const start = Date.now()

    const response = await openrouter.chat.completions.create({
      model: SEO_MODEL,
      messages: [
        { role: 'system', content: SEO_SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const aiResponse = response.choices[0]?.message?.content ?? ''
    const latencyMs = Date.now() - start
    const tokens = response.usage?.completion_tokens ?? 0

    // Save to content history
    const content = await prisma.content.create({
      data: {
        userId,
        title: keyword ?? message.slice(0, 60),
        type: 'SEO_BRIEF',
        body: aiResponse,
        toolUsed: 'seo_assistant',
        creditsUsed: SEO_CREDIT_COST,
        tokensUsed: tokens,
        metadata: { latencyMs, model: SEO_MODEL, url, keyword },
      },
    })

    await deductCredits(userId, SEO_CREDIT_COST, 'seo_assistant', content.id)

    return success(res, {
      blocked: false,
      response: aiResponse,
      model: SEO_MODEL,
      usage: { tokens, latencyMs },
    })
  } catch (err: any) {
    return next(new AppError(500, ErrorCodes.AI_PROVIDER_ERROR, err.message))
  }
}
