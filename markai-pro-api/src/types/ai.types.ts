import { Plan } from '@prisma/client'

export interface BrandVoiceProfile {
  systemPrompt: string | null
  formalCasual: number
  seriousPlayful: number
  reservedBold: number
  traditionalInno: number
  technicalSimple: number
  wordsToUse: string[]
  wordsToAvoid: string[]
}

export interface AIGenerationResult {
  content: string
  parsed?: Record<string, unknown>
  inputTokens: number
  outputTokens: number
  model: string
  latencyMs: number
}

export interface StreamEvent {
  type: 'chunk' | 'done' | 'error' | 'progress'
  data?: string
  message?: string
  metadata?: {
    wordCount?: number
    tokens?: number
    creditsUsed?: number
    timestamp?: string
    platform?: string
  }
}

export const TOOL_CREDITS: Record<string, number> = {
  blog_writer: 15,
  caption_generator: 3,
  email_sequence: 12,
  video_script: 8,
  image_prompt: 2,
  campaign_builder: 40,
  ad_copy_generator: 5,
  landing_page_writer: 10,
  ab_headline_tester: 4,
  cta_optimizer: 2,
  keyword_cluster: 4,
  seo_brief_generator: 6,
  meta_tag_writer: 2,
  content_repurposer: 10,
  competitor_spy: 20,
  persona_builder: 8,
  analytics_narrator: 10,
  funnel_planner: 12,
  brand_voice_trainer: 15,
  content_calendar: 20,
  report_generator: 10,
  seo_assistant: 5,
  off_page_seo: 8,
  technical_seo: 8,
  local_seo: 6,
  ecommerce_seo: 6,
  voice_search_seo: 5,
  image_seo: 3,
  mobile_seo: 5,
  international_seo: 8,
  white_hat_checker: 5,
}

export const PLAN_CREDITS: Record<Plan, number> = {
  FREE: 50,
  STARTER: 500,
  PRO: 2000,
  AGENCY: 10000,
}

export const PLAN_FEATURES: Record<Plan, {
  maxContent: number
  maxCampaigns: number
  maxClients: number
  maxTeamMembers: number
  brandVoice: boolean
  competitorSpy: boolean
  campaignBuilder: boolean
  whitelabelReports: boolean
  apiAccess: boolean
  contentCalendar: boolean
  approvalFlow: boolean
}> = {
  FREE: {
    maxContent: 50,
    maxCampaigns: 1,
    maxClients: 0,
    maxTeamMembers: 0,
    brandVoice: false,
    competitorSpy: false,
    campaignBuilder: false,
    whitelabelReports: false,
    apiAccess: false,
    contentCalendar: false,
    approvalFlow: false,
  },
  STARTER: {
    maxContent: 500,
    maxCampaigns: 5,
    maxClients: 0,
    maxTeamMembers: 0,
    brandVoice: true,
    competitorSpy: false,
    campaignBuilder: false,
    whitelabelReports: false,
    apiAccess: false,
    contentCalendar: true,
    approvalFlow: false,
  },
  PRO: {
    maxContent: -1,
    maxCampaigns: -1,
    maxClients: 0,
    maxTeamMembers: 0,
    brandVoice: true,
    competitorSpy: true,
    campaignBuilder: true,
    whitelabelReports: false,
    apiAccess: false,
    contentCalendar: true,
    approvalFlow: false,
  },
  AGENCY: {
    maxContent: -1,
    maxCampaigns: -1,
    maxClients: -1,
    maxTeamMembers: 20,
    brandVoice: true,
    competitorSpy: true,
    campaignBuilder: true,
    whitelabelReports: true,
    apiAccess: true,
    contentCalendar: true,
    approvalFlow: true,
  },
}
