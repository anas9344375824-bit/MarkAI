import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { generateCompletion, streamCompletion } from '../services/ai/aiRouter'
import { buildFinalPrompt } from '../services/ai/promptBuilder'
import { streamAIResponse } from '../services/ai/streamHandler'
import { deductCredits } from '../services/credits.service'
import { TOOL_CREDITS } from '../types/ai.types'
import { success, AppError, ErrorCodes } from '../utils/apiResponse'
import { countWords, parseJsonSafe } from '../utils/helpers'

// Import all tool modules
import * as blogWriter from '../services/ai/tools/blogWriter'
import * as captionGen from '../services/ai/tools/captionGenerator'
import * as emailSeq from '../services/ai/tools/emailSequence'
import * as videoScript from '../services/ai/tools/videoScript'
import * as imagePrompt from '../services/ai/tools/imagePrompt'
import * as adCopy from '../services/ai/tools/adCopyGenerator'
import * as landingPage from '../services/ai/tools/landingPageWriter'
import * as abHeadline from '../services/ai/tools/abHeadlineTester'
import * as ctaOpt from '../services/ai/tools/ctaOptimizer'
import * as kwCluster from '../services/ai/tools/keywordCluster'
import * as seoBrief from '../services/ai/tools/seoBriefGenerator'
import * as metaTag from '../services/ai/tools/metaTagWriter'
import * as repurposer from '../services/ai/tools/contentRepurposer'
import * as competitorSpy from '../services/ai/tools/competitorSpy'
import * as persona from '../services/ai/tools/personaBuilder'
import * as analytics from '../services/ai/tools/analyticsNarrator'
import * as funnel from '../services/ai/tools/funnelPlanner'
import * as bvTrainer from '../services/ai/tools/brandVoiceTrainer'
import * as calendar from '../services/ai/tools/contentCalendar'
import * as reportGen from '../services/ai/tools/reportGenerator'
import * as offPageSeo from '../services/ai/tools/offPageSeo'
import * as technicalSeo from '../services/ai/tools/technicalSeo'
import * as localSeo from '../services/ai/tools/localSeo'
import * as ecommerceSeo from '../services/ai/tools/ecommerceSeo'
import * as voiceSearchSeo from '../services/ai/tools/voiceSearchSeo'
import * as imageSeo from '../services/ai/tools/imageSeo'
import * as mobileSeo from '../services/ai/tools/mobileSeo'
import * as internationalSeo from '../services/ai/tools/internationalSeo'
import * as whiteHatChecker from '../services/ai/tools/whiteHatChecker'
import { SEO_SYSTEM_PROMPT, buildSeoUserPrompt } from '../prompts/seo.prompt'
import { ContentType, Platform } from '@prisma/client'

const TOOL_REGISTRY: Record<string, {
  system: string
  buildPrompt: (inputs: Record<string, unknown>, bv?: unknown) => string
  contentType: ContentType
}> = {
  blog_writer: { system: blogWriter.SYSTEM_PROMPT, buildPrompt: (i, bv) => blogWriter.buildUserPrompt(i as blogWriter.BlogWriterInputs, bv as never), contentType: 'BLOG_POST' },
  caption_generator: { system: captionGen.SYSTEM_PROMPT, buildPrompt: (i, bv) => captionGen.buildUserPrompt(i as captionGen.CaptionInputs, bv as never), contentType: 'SOCIAL_CAPTION' },
  email_sequence: { system: emailSeq.SYSTEM_PROMPT, buildPrompt: (i, bv) => emailSeq.buildUserPrompt(i as emailSeq.EmailSequenceInputs, bv as never), contentType: 'EMAIL_SEQUENCE' },
  video_script: { system: videoScript.SYSTEM_PROMPT, buildPrompt: (i, bv) => videoScript.buildUserPrompt(i as videoScript.VideoScriptInputs, bv as never), contentType: 'VIDEO_SCRIPT' },
  image_prompt: { system: imagePrompt.SYSTEM_PROMPT, buildPrompt: (i) => imagePrompt.buildUserPrompt(i as imagePrompt.ImagePromptInputs), contentType: 'IMAGE_PROMPT' },
  ad_copy_generator: { system: adCopy.SYSTEM_PROMPT, buildPrompt: (i, bv) => adCopy.buildUserPrompt(i as adCopy.AdCopyInputs, bv as never), contentType: 'AD_COPY' },
  landing_page_writer: { system: landingPage.SYSTEM_PROMPT, buildPrompt: (i, bv) => landingPage.buildUserPrompt(i as never, bv as never), contentType: 'LANDING_PAGE' },
  ab_headline_tester: { system: abHeadline.SYSTEM_PROMPT, buildPrompt: (i) => abHeadline.buildUserPrompt(i as never), contentType: 'HEADLINE_VARIANTS' },
  cta_optimizer: { system: ctaOpt.SYSTEM_PROMPT, buildPrompt: (i) => ctaOpt.buildUserPrompt(i as never), contentType: 'CTA_VARIANTS' },
  keyword_cluster: { system: kwCluster.SYSTEM_PROMPT, buildPrompt: (i) => kwCluster.buildUserPrompt(i as never), contentType: 'KEYWORDS' },
  seo_brief_generator: { system: seoBrief.SYSTEM_PROMPT, buildPrompt: (i) => seoBrief.buildUserPrompt(i as never), contentType: 'SEO_BRIEF' },
  meta_tag_writer: { system: metaTag.SYSTEM_PROMPT, buildPrompt: (i) => metaTag.buildUserPrompt(i as never), contentType: 'META_TAGS' },
  content_repurposer: { system: repurposer.SYSTEM_PROMPT, buildPrompt: (i, bv) => repurposer.buildUserPrompt(i as never, bv as never), contentType: 'REPURPOSED_SET' },
  competitor_spy: { system: competitorSpy.SYSTEM_PROMPT, buildPrompt: (i) => competitorSpy.buildCompetitorPrompt(i.scrapedContent as string, i.url as string), contentType: 'COMPETITOR_ANALYSIS' },
  persona_builder: { system: persona.SYSTEM_PROMPT, buildPrompt: (i) => persona.buildUserPrompt(i as never), contentType: 'PERSONA' },
  analytics_narrator: { system: analytics.SYSTEM_PROMPT, buildPrompt: (i) => analytics.buildUserPrompt(i as never), contentType: 'ANALYTICS_REPORT' },
  funnel_planner: { system: funnel.SYSTEM_PROMPT, buildPrompt: (i) => funnel.buildUserPrompt(i as never), contentType: 'FUNNEL_MAP' },
  brand_voice_trainer: { system: bvTrainer.SYSTEM_PROMPT, buildPrompt: (i) => bvTrainer.buildUserPrompt(i as never), contentType: 'BRAND_VOICE_PROFILE' },
  content_calendar: { system: calendar.SYSTEM_PROMPT, buildPrompt: (i, bv) => calendar.buildUserPrompt(i as never, bv as never), contentType: 'CONTENT_CALENDAR' },
  report_generator:    { system: reportGen.SYSTEM_PROMPT,      buildPrompt: (i) => reportGen.buildUserPrompt(i as never),                        contentType: 'ANALYTICS_REPORT' },
  seo_assistant:        { system: SEO_SYSTEM_PROMPT,             buildPrompt: (i) => buildSeoUserPrompt(i as never),                              contentType: 'SEO_BRIEF' },
  off_page_seo:         { system: offPageSeo.SYSTEM_PROMPT,      buildPrompt: (i) => offPageSeo.buildUserPrompt(i as never),                      contentType: 'SEO_BRIEF' },
  technical_seo:        { system: technicalSeo.SYSTEM_PROMPT,    buildPrompt: (i) => technicalSeo.buildUserPrompt(i as never),                    contentType: 'SEO_BRIEF' },
  local_seo:            { system: localSeo.SYSTEM_PROMPT,        buildPrompt: (i) => localSeo.buildUserPrompt(i as never),                        contentType: 'SEO_BRIEF' },
  ecommerce_seo:        { system: ecommerceSeo.SYSTEM_PROMPT,    buildPrompt: (i) => ecommerceSeo.buildUserPrompt(i as never),                    contentType: 'SEO_BRIEF' },
  voice_search_seo:     { system: voiceSearchSeo.SYSTEM_PROMPT,  buildPrompt: (i) => voiceSearchSeo.buildUserPrompt(i as never),                  contentType: 'SEO_BRIEF' },
  image_seo:            { system: imageSeo.SYSTEM_PROMPT,        buildPrompt: (i) => imageSeo.buildUserPrompt(i as never),                        contentType: 'SEO_BRIEF' },
  mobile_seo:           { system: mobileSeo.SYSTEM_PROMPT,       buildPrompt: (i) => mobileSeo.buildUserPrompt(i as never),                       contentType: 'SEO_BRIEF' },
  international_seo:    { system: internationalSeo.SYSTEM_PROMPT, buildPrompt: (i) => internationalSeo.buildUserPrompt(i as never),                contentType: 'SEO_BRIEF' },
  white_hat_checker:    { system: whiteHatChecker.SYSTEM_PROMPT, buildPrompt: (i) => whiteHatChecker.buildUserPrompt(i as never),                  contentType: 'SEO_BRIEF' },
}

export const listTools = async (_req: Request, res: Response) => {
  const toolList = Object.entries(TOOL_CREDITS).map(([slug, cost]) => ({
    slug,
    creditCost: cost,
    name: slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
  }))
  return success(res, toolList)
}

export const generateStream = async (req: Request, res: Response, next: NextFunction) => {
  const { toolSlug } = req.params
  const tool = TOOL_REGISTRY[toolSlug]
  if (!tool) return next(new AppError(404, ErrorCodes.NOT_FOUND, `Tool "${toolSlug}" not found`))

  const userId = req.user!.id
  const cost = req.toolCreditCost!

  const brandVoice = await prisma.brandVoice.findUnique({ where: { userId } })
  const { system, user: userPrompt } = buildFinalPrompt(tool.system, tool.buildPrompt(req.body, brandVoice), brandVoice)

  const start = Date.now()

  await streamAIResponse(
    res,
    () => streamCompletion(system, userPrompt),
    async (fullText, tokens) => {
      const content = await prisma.content.create({
        data: {
          userId,
          title: req.body.topic ?? req.body.goal ?? req.body.product ?? 'Generated content',
          type: tool.contentType,
          body: fullText,
          toolUsed: toolSlug,
          creditsUsed: cost,
          tokensUsed: tokens,
          metadata: { wordCount: countWords(fullText), latencyMs: Date.now() - start },
        },
      })
      await deductCredits(userId, cost, toolSlug, content.id)
      await prisma.usageLog.create({
        data: { userId, toolName: toolSlug, outputTokens: tokens, model: 'gpt-4o', latencyMs: Date.now() - start, success: true },
      })
    }
  )
}

export const generateSync = async (req: Request, res: Response, next: NextFunction) => {
  const { toolSlug } = req.params
  const tool = TOOL_REGISTRY[toolSlug]
  if (!tool) return next(new AppError(404, ErrorCodes.NOT_FOUND, `Tool "${toolSlug}" not found`))

  const userId = req.user!.id
  const cost = req.toolCreditCost!
  const start = Date.now()

  const brandVoice = await prisma.brandVoice.findUnique({ where: { userId } })
  const { system, user: userPrompt } = buildFinalPrompt(tool.system, tool.buildPrompt(req.body, brandVoice), brandVoice)

  const result = await generateCompletion(system, userPrompt, { jsonMode: true })

  const content = await prisma.content.create({
    data: {
      userId,
      title: req.body.topic ?? req.body.goal ?? req.body.product ?? 'Generated content',
      type: tool.contentType,
      body: result.content,
      toolUsed: toolSlug,
      creditsUsed: cost,
      tokensUsed: result.outputTokens,
      metadata: { wordCount: countWords(result.content), latencyMs: Date.now() - start },
    },
  })

  await deductCredits(userId, cost, toolSlug, content.id)
  await prisma.usageLog.create({
    data: { userId, toolName: toolSlug, inputTokens: result.inputTokens, outputTokens: result.outputTokens, model: result.model, latencyMs: result.latencyMs, success: true },
  })

  res.setHeader('X-Credits-Remaining', req.user!.credits - cost)
  return success(res, {
    content: { id: content.id, body: result.content, parsed: parseJsonSafe(result.content) },
    metadata: { wordCount: countWords(result.content), tokens: result.outputTokens, creditsUsed: cost },
  })
}

export const getHistory = async (req: Request, res: Response) => {
  const { toolSlug, page = '1', limit = '10' } = req.query as Record<string, string>
  const skip = (parseInt(page) - 1) * parseInt(limit)

  const where = { userId: req.user!.id, ...(toolSlug ? { toolUsed: toolSlug } : {}) }
  const [items, total] = await Promise.all([
    prisma.content.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit) }),
    prisma.content.count({ where }),
  ])

  return success(res, items, { page: parseInt(page), limit: parseInt(limit), total })
}
