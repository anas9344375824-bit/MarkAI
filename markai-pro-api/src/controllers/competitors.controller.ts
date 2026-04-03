import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { success, paginated, AppError, ErrorCodes } from '../utils/apiResponse'
import { generateCompletion } from '../services/ai/aiRouter'
import { buildFinalPrompt } from '../services/ai/promptBuilder'
import { deductCredits } from '../services/credits.service'
import { TOOL_CREDITS } from '../types/ai.types'
import { parseJsonSafe } from '../utils/helpers'
import * as competitorSpy from '../services/ai/tools/competitorSpy'
import * as cheerio from 'cheerio'

const scrapeUrl = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MarkAIBot/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    const html = await res.text()
    const $ = cheerio.load(html)
    $('script, style, nav, footer, header').remove()
    return $('body').text().replace(/\s+/g, ' ').trim().substring(0, 10000)
  } catch {
    return ''
  }
}

export const listReports = async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const [items, total] = await Promise.all([
    prisma.competitorReport.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
    prisma.competitorReport.count({ where: { userId: req.user!.id } }),
  ])
  return paginated(res, items, total, parseInt(page), parseInt(limit))
}

export const analyseCompetitor = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.id
  const cost = TOOL_CREDITS.competitor_spy
  const { url } = req.body

  const scrapedContent = await scrapeUrl(url)
  if (!scrapedContent) return next(new AppError(400, 'SCRAPE_FAILED', 'Could not fetch competitor URL'))

  const { system, user: userPrompt } = buildFinalPrompt(
    competitorSpy.SYSTEM_PROMPT,
    competitorSpy.buildCompetitorPrompt(scrapedContent, url),
    null
  )

  const result = await generateCompletion(system, userPrompt, { jsonMode: true })
  const parsed = parseJsonSafe<Record<string, unknown>>(result.content)
  if (!parsed) return next(new AppError(500, 'AI_001', 'Failed to parse competitor analysis'))

  const report = await prisma.competitorReport.create({
    data: {
      userId,
      competitorUrl: url,
      competitorName: parsed.competitorName as string ?? url,
      messagingAnalysis: parsed.messagingAnalysis as object,
      contentStrategy: parsed.contentStrategy as object,
      keywordGaps: parsed.keywordGaps as object,
      counterStrategy: parsed.counterStrategy as object,
      rawAnalysis: result.content,
    },
  })

  await deductCredits(userId, cost, 'competitor_spy')
  return success(res, { report, creditsUsed: cost }, undefined, 201)
}

export const getReport = async (req: Request, res: Response, next: NextFunction) => {
  const report = await prisma.competitorReport.findFirst({ where: { id: req.params.id, userId: req.user!.id } })
  if (!report) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Report not found'))
  return success(res, report)
}

export const deleteReport = async (req: Request, res: Response, next: NextFunction) => {
  const report = await prisma.competitorReport.findFirst({ where: { id: req.params.id, userId: req.user!.id } })
  if (!report) return next(new AppError(404, ErrorCodes.NOT_FOUND, 'Report not found'))
  await prisma.competitorReport.delete({ where: { id: req.params.id } })
  return success(res, { message: 'Report deleted' })
}
