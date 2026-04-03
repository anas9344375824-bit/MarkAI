import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Copy,
  Download,
  Info,
  LoaderCircle,
  Mic,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { tools } from '../../data/mockData'
import { cn } from '../../lib/utils'

type SearchIntent = 'Informational' | 'Commercial' | 'Transactional' | 'Navigational'
type ToneOption =
  | 'Professional'
  | 'Conversational'
  | 'Authoritative'
  | 'Friendly'
  | 'Bold'
  | 'Academic'
type SerpTarget = 'Featured Snippet' | 'People Also Ask' | 'None'

type InternalLink = {
  id: string
  anchor: string
  url: string
}

type SeoToggleKey =
  | 'targetFeaturedSnippet'
  | 'includeFaq'
  | 'tableOfContents'
  | 'includeStats'
  | 'generateSchema'
  | 'includeExpertQuotes'

type ResearchData = {
  keywordDifficulty: string
  targetWordCount: number
  featuredSnippet: string
  lsiKeywords: string[]
  peopleAlsoAsk: string[]
  contentGaps: string[]
}

type SeoAnalysis = {
  score: number
  grade: string
  verdict: string
  checks: string[]
  warning: string
}

type OutputState = 'empty' | 'researching' | 'research-complete' | 'writing' | 'done'

type ValidationErrors = {
  topic?: string
  audience?: string
}

const SEARCH_INTENTS: SearchIntent[] = [
  'Informational',
  'Commercial',
  'Transactional',
  'Navigational',
]

const TONE_OPTIONS: ToneOption[] = [
  'Professional',
  'Conversational',
  'Authoritative',
  'Friendly',
  'Bold',
  'Academic',
]

const SERP_OPTIONS: SerpTarget[] = [
  'Featured Snippet',
  'People Also Ask',
  'None',
]

const LENGTH_OPTIONS = [
  { value: 500, label: 'Quick post (500w)' },
  { value: 1000, label: 'Standard (1000w)' },
  { value: 1500, label: 'Medium (1500w)' },
  { value: 2000, label: 'Long-form (2000w)' },
  { value: 3000, label: 'Deep dive (3000w)' },
  { value: 5000, label: 'Pillar content (5000w)' },
] as const

const DEFAULT_ADVANCED_OPTIONS: Record<SeoToggleKey, boolean> = {
  targetFeaturedSnippet: true,
  includeFaq: true,
  tableOfContents: true,
  includeStats: true,
  generateSchema: true,
  includeExpertQuotes: false,
}

const SEARCH_INTENT_TOOLTIP =
  'Informational = how-to / guides. Commercial = comparisons. Transactional = buy now. Navigational = find a specific site.'

const EXAMPLE_VALUES = {
  topic: 'Best email marketing strategies for SaaS startups in 2025',
  secondaryKeywords: [
    'email automation',
    'drip campaigns',
    'SaaS onboarding emails',
    'email open rates',
  ],
  audience: 'SaaS founders and product marketers',
  searchIntent: 'Informational' as SearchIntent,
  tone: 'Professional' as ToneOption,
  articleLength: 2000,
  serpTarget: 'Featured Snippet' as SerpTarget,
  advancedOptions: DEFAULT_ADVANCED_OPTIONS,
}

const RESEARCH_KEYWORD_BANK = [
  'email automation workflows',
  'SaaS onboarding funnel',
  'lead nurturing emails',
  'welcome email optimization',
  'B2B email campaign strategy',
  'email deliverability tips',
  'customer retention emails',
  'lifecycle messaging',
  'trial conversion emails',
  'segmentation best practices',
  'email CTR benchmarks',
  'newsletter engagement',
  'email personalization tactics',
  'drip campaign examples',
  'win-back email strategy',
  'SaaS lifecycle marketing',
]

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, char => char.toUpperCase())
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function buildQuickAnswer(topic: string, audience: string) {
  const normalizedTopic = topic.trim() || 'this topic'
  const normalizedAudience = audience.trim() || 'your audience'

  return `The best ${normalizedTopic.toLowerCase()} approach for ${normalizedAudience.toLowerCase()} is to combine clear audience segmentation, keyword-driven content structure, strong calls to action, and consistent performance tracking. That mix improves rankings, engagement, and conversions while making your article more useful and easier to publish quickly.`
}

function buildMockResearch(
  topic: string,
  articleLength: number,
  secondaryKeywords: string[],
  serpTarget: SerpTarget
): ResearchData {
  const topicBase = topic.trim() || 'email marketing strategy'
  const baseKeywords = [
    ...secondaryKeywords,
    ...RESEARCH_KEYWORD_BANK.map(keyword =>
      keyword.includes('email') || topicBase.toLowerCase().includes('email')
        ? keyword
        : `${topicBase} ${keyword.split(' ').slice(-2).join(' ')}`
    ),
  ]

  const lsiKeywords = Array.from(new Set(baseKeywords)).slice(0, 16)
  const peopleAlsoAsk = [
    `How do ${topicBase.toLowerCase()} campaigns improve conversions?`,
    `What is the best way to structure ${topicBase.toLowerCase()} content?`,
    `Why does ${topicBase.toLowerCase()} performance drop over time?`,
    `Which metrics matter most for ${topicBase.toLowerCase()}?`,
    `How often should teams update ${topicBase.toLowerCase()} strategy?`,
    `What tools help scale ${topicBase.toLowerCase()} execution?`,
    `How do startups measure ROI from ${topicBase.toLowerCase()}?`,
    `What mistakes should brands avoid with ${topicBase.toLowerCase()}?`,
  ]

  return {
    keywordDifficulty: articleLength >= 3000 ? 'High' : articleLength >= 1500 ? 'Medium' : 'Low',
    targetWordCount: Math.round(articleLength * 1.05),
    featuredSnippet:
      serpTarget === 'None'
        ? 'No snippet target'
        : serpTarget === 'People Also Ask'
          ? 'Question-led answer blocks'
          : 'Paragraph format',
    lsiKeywords,
    peopleAlsoAsk,
    contentGaps: [
      `Competitors rarely explain implementation frameworks for ${topicBase.toLowerCase()}`,
      `Very few articles include benchmark data and examples tailored to niche audiences`,
    ],
  }
}

function buildMarkdownArticle(params: {
  topic: string
  audience: string
  searchIntent: SearchIntent
  tone: ToneOption
  articleLength: number
  secondaryKeywords: string[]
  advancedOptions: Record<SeoToggleKey, boolean>
  internalLinks: InternalLink[]
  quickAnswer: string
}) {
  const {
    topic,
    audience,
    searchIntent,
    tone,
    articleLength,
    secondaryKeywords,
    advancedOptions,
    internalLinks,
    quickAnswer,
  } = params

  const topicLine = topic.trim() || 'Blog topic'
  const audienceLine = audience.trim() || 'growth-focused marketing teams'
  const readMinutes = Math.max(3, Math.round(articleLength / 250))
  const sectionCount = articleLength >= 3000 ? 6 : articleLength >= 2000 ? 5 : 4
  const headingIds = [
    'why-this-matters',
    'core-strategy',
    'implementation-framework',
    'common-mistakes',
    'measuring-performance',
    'next-steps',
  ].slice(0, sectionCount)

  const toc = advancedOptions.tableOfContents
    ? [
        '## Table of Contents',
        ...headingIds.map((id, index) => {
          const labels = [
            'Why this matters',
            'Core strategy pillars',
            'Implementation framework',
            'Common mistakes to avoid',
            'Measuring performance',
            'Next steps',
          ]
          return `${index + 1}. [${labels[index]}](#${id})`
        }),
        '',
      ]
    : []

  const statsBlock = advancedOptions.includeStats
    ? [
        `- Teams using focused ${topicLine.toLowerCase()} programs often see 20–40% stronger engagement when they align content with intent and audience stage.`,
        '- Articles with clear structure, data points, and practical examples tend to earn more dwell time and better snippet visibility.',
        '- Consistent internal linking and FAQ coverage improve topical authority over time.',
        '',
      ]
    : []

  const quoteBlock = advancedOptions.includeExpertQuotes
    ? [
        '> “The highest-performing SEO content is rarely the longest piece. It is the clearest answer to the right question at the right moment.”',
        '',
      ]
    : []

  const internalLinksBlock =
    internalLinks.length > 0
      ? [
          '## Recommended Internal Links',
          ...internalLinks.map(link => `- [${link.anchor || 'Untitled link'}](${link.url || '/'})`),
          '',
        ]
      : []

  const faqBlock = advancedOptions.includeFaq
    ? [
        '## Frequently Asked Questions',
        '',
        `### How long does it take to see results from ${topicLine}?`,
        `Most teams see early signs of traction within a few weeks, but meaningful SEO gains usually build over several months as the content earns visibility and trust.`,
        '',
        `### What should ${audienceLine} prioritise first?`,
        `Start with search intent, a tightly scoped outline, and one measurable conversion goal. That foundation makes every other optimisation easier.`,
        '',
        `### How do you keep ${topicLine.toLowerCase()} content competitive?`,
        `Refresh statistics, expand sections that answer People Also Ask questions, and add examples, internal links, and stronger evidence of experience.`,
        '',
      ]
    : []

  const schemaBlock = advancedOptions.generateSchema
    ? [
        '```json',
        JSON.stringify(
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: topicLine,
            audience: {
              '@type': 'Audience',
              audienceType: audienceLine,
            },
            about: secondaryKeywords.length ? secondaryKeywords : [topicLine],
          },
          null,
          2
        ),
        '```',
        '',
      ]
    : []

  const keywordLine = secondaryKeywords.length
    ? `Primary support keywords include ${secondaryKeywords.slice(0, 4).join(', ')}.`
    : 'The article is structured to reinforce the primary topic naturally without overstuffing keywords.'

  return [
    `# ${topicLine}`,
    '',
    `> **Search intent:** ${searchIntent}  `,
    `> **Tone:** ${tone}  `,
    `> **Target audience:** ${audienceLine}  `,
    `> **Estimated reading time:** ${readMinutes} min`,
    '',
    '## ⭐ Quick Answer',
    '',
    quickAnswer,
    '',
    ...toc,
    '## Why this matters',
    '',
    `${topicLine} matters because modern search performance depends on clarity, structure, and relevance. For ${audienceLine}, the opportunity is not just to publish more often, but to publish content that earns trust quickly and moves readers toward the next step.`,
    '',
    keywordLine,
    '',
    ...statsBlock,
    '## Core strategy pillars',
    '',
    `To compete effectively, build the article around one clear promise, several semantically related subtopics, and practical takeaways. This keeps the page useful for readers and highly legible for search engines.`,
    '',
    '- Lead with the primary question the reader wants answered.',
    '- Support that answer with examples, frameworks, and proof points.',
    '- Optimise headings so each section is scannable and specific.',
    '- Use internal links to connect the article to related conversion pages.',
    '',
    ...quoteBlock,
    '## Implementation framework',
    '',
    `Start by outlining the article around the exact outcomes ${audienceLine.toLowerCase()} care about most. Then build each section so it answers one question clearly, adds evidence, and naturally introduces the next topic.`,
    '',
    '### Step 1: Define the angle',
    `Choose a narrow angle for ${topicLine.toLowerCase()} so the article feels decisive, not generic.`,
    '',
    '### Step 2: Build the outline',
    'Map headings to the search journey: problem, solution, process, pitfalls, and action steps.',
    '',
    '### Step 3: Add proof',
    'Include benchmarks, examples, or process notes that strengthen credibility and improve E-E-A-T.',
    '',
    '## Common mistakes to avoid',
    '',
    '- Publishing broad introductions that never answer the search intent directly.',
    '- Skipping structure, which makes the article harder to scan and weaker for featured snippets.',
    '- Ignoring internal links, FAQs, and schema opportunities that help search engines understand the page.',
    '- Using a tone that does not match the reader or the brand.',
    '',
    '## Measuring performance',
    '',
    `Track rankings, click-through rate, scroll depth, and downstream conversions. The strongest ${topicLine.toLowerCase()} articles do more than attract traffic — they create measurable business movement.`,
    '',
    '## Next steps',
    '',
    'Turn this draft into a publish-ready asset by adding product context, brand-specific examples, external citations, and any editorial preferences your team uses.',
    '',
    ...internalLinksBlock,
    ...faqBlock,
    ...(advancedOptions.generateSchema ? ['## Schema Markup', '', ...schemaBlock] : []),
  ].join('\n')
}

function markdownToHtml(markdown: string) {
  const blocks = markdown.split(/\n{2,}/)
  let listType: 'ul' | 'ol' | null = null

  return blocks
    .map(block => {
      const trimmed = block.trim()
      if (!trimmed) return ''

      if (trimmed.startsWith('```json')) {
        const code = trimmed.replace(/^```json/, '').replace(/```$/, '').trim()
        return `<pre><code>${escapeHtml(code)}</code></pre>`
      }

      if (trimmed.startsWith('# ')) {
        return `<h1>${escapeHtml(trimmed.slice(2))}</h1>`
      }

      if (trimmed.startsWith('## ')) {
        const value = trimmed.slice(3)
        if (value === '⭐ Quick Answer') return ''
        return `<h2>${escapeHtml(value)}</h2>`
      }

      if (trimmed.startsWith('### ')) {
        return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`
      }

      if (trimmed.startsWith('> ')) {
        const lines = trimmed
          .split('\n')
          .map(line => line.replace(/^>\s?/, '').trim())
          .map(applyInlineMarkdown)
          .join('<br />')
        return `<blockquote>${lines}</blockquote>`
      }

      const lines = trimmed.split('\n')
      const isBulletList = lines.every(line => /^- /.test(line))
      const isOrderedList = lines.every(line => /^\d+\. /.test(line))

      if (isBulletList) {
        listType = 'ul'
        return `<ul>${lines.map(line => `<li>${applyInlineMarkdown(line.replace(/^- /, ''))}</li>`).join('')}</ul>`
      }

      if (isOrderedList) {
        listType = 'ol'
        return `<ol>${lines.map(line => `<li>${applyInlineMarkdown(line.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`
      }

      listType = null
      return `<p>${lines.map(applyInlineMarkdown).join('<br />')}</p>`
    })
    .join('')
}

function applyInlineMarkdown(value: string) {
  let html = escapeHtml(value)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  return html
}

function getArticlePlainText(markdown: string) {
  return markdown
    .replace(/```json[\s\S]*?```/g, '')
    .replace(/^#+\s?/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/[*`]/g, '')
}

export default function ToolPage() {
  const { toolId } = useParams()
  const navigate = useNavigate()
  const { deductCredit, addNotification, user } = useAppStore()
  const tool = useMemo(() => tools.find(item => item.id === toolId) || tools[0], [toolId])

  const isBlogWriter = toolId === 'blog-writer'

  const [topic, setTopic] = useState('')
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [audience, setAudience] = useState('')
  const [searchIntent, setSearchIntent] = useState<SearchIntent>('Informational')
  const [tone, setTone] = useState<ToneOption>('Professional')
  const [lengthIndex, setLengthIndex] = useState(2)
  const [serpTarget, setSerpTarget] = useState<SerpTarget>('Featured Snippet')
  const [linksExpanded, setLinksExpanded] = useState(false)
  const [internalLinks, setInternalLinks] = useState<InternalLink[]>([])
  const [advancedExpanded, setAdvancedExpanded] = useState(false)
  const [advancedOptions, setAdvancedOptions] = useState(DEFAULT_ADVANCED_OPTIONS)
  const [brandVoiceEnabled, setBrandVoiceEnabled] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const [outputState, setOutputState] = useState<OutputState>('empty')
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [streamedArticle, setStreamedArticle] = useState('')
  const [finalArticle, setFinalArticle] = useState('')
  const [editableArticle, setEditableArticle] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [currentLoadingLabel, setCurrentLoadingLabel] = useState('Researching SEO...')
  const [metaInfo, setMetaInfo] = useState({ words: 0, readMinutes: 0, score: 0 })
  const [creditsEstimate, setCreditsEstimate] = useState(20)

  const abortRef = useRef<AbortController | null>(null)
  const loadingTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isBlogWriter) return
    return () => {
      abortRef.current?.abort()
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current)
      }
    }
  }, [isBlogWriter])

  useEffect(() => {
    const articleLength = LENGTH_OPTIONS[lengthIndex]?.value ?? 1500
    const estimatedCredits = articleLength >= 3000 ? 28 : articleLength >= 2000 ? 20 : articleLength >= 1000 ? 14 : 10
    setCreditsEstimate(estimatedCredits)
  }, [lengthIndex])

  useEffect(() => {
    if (!brandVoiceEnabled) return
    toast.success('Brand voice active')
  }, [brandVoiceEnabled])

  if (!isBlogWriter) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-[#5A5A78] mb-6">
          <button onClick={() => navigate('/tools')} className="hover:text-[#9494B0] transition-colors">
            Tools
          </button>
          <ChevronRight size={14} />
          <span className="text-[#9494B0]">{tool.category}</span>
          <ChevronRight size={14} />
          <span className="text-[#F0EFFF]">{tool.name}</span>
        </div>

        <div className="rounded-3xl border border-[#2A2A3A] bg-[#111118] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A1A24] text-3xl">
            {tool.icon}
          </div>
          <h1 className="text-2xl font-medium text-[#F0EFFF]">{tool.name}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#9494B0]">
            This tool page has been preserved. Only `/tools/blog-writer` was restored and upgraded.
          </p>
        </div>
      </div>
    )
  }

  const articleLength = LENGTH_OPTIONS[lengthIndex]
  const seoScore = finalArticle ? calculateSeoAnalysis(finalArticle, researchData, advancedOptions, articleLength.value).score : 87
  const seoAnalysis = finalArticle
    ? calculateSeoAnalysis(finalArticle, researchData, advancedOptions, articleLength.value)
    : {
        score: 87,
        grade: 'A',
        verdict: 'Excellent',
        checks: [
          '16/16 LSI keywords covered',
          '8/8 PAA questions answered',
          'Featured snippet optimised',
          '2,340 words · above benchmark',
          'Schema markup generated',
        ],
        warning: 'Add more external citations for stronger E-E-A-T',
      }

  function handleFillExample() {
    setTopic(EXAMPLE_VALUES.topic)
    setSecondaryKeywords(EXAMPLE_VALUES.secondaryKeywords)
    setKeywordInput('')
    setAudience(EXAMPLE_VALUES.audience)
    setSearchIntent(EXAMPLE_VALUES.searchIntent)
    setTone(EXAMPLE_VALUES.tone)
    setLengthIndex(LENGTH_OPTIONS.findIndex(item => item.value === EXAMPLE_VALUES.articleLength))
    setSerpTarget(EXAMPLE_VALUES.serpTarget)
    setAdvancedOptions(EXAMPLE_VALUES.advancedOptions)
    setLinksExpanded(false)
    setInternalLinks([])
    setAdvancedExpanded(false)
    setBrandVoiceEnabled(false)
    setValidationErrors({})
    setOutputState('empty')
    setResearchData(null)
    setStreamedArticle('')
    setFinalArticle('')
    setEditableArticle('')
    setIsEditing(false)
  }

  function handleKeywordKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return
    event.preventDefault()

    const nextKeyword = keywordInput.trim()
    if (!nextKeyword || secondaryKeywords.length >= 10) return
    if (secondaryKeywords.some(keyword => keyword.toLowerCase() === nextKeyword.toLowerCase())) {
      setKeywordInput('')
      return
    }

    setSecondaryKeywords(prev => [...prev, nextKeyword])
    setKeywordInput('')
  }

  function addInternalLink() {
    if (internalLinks.length >= 10) return
    setLinksExpanded(true)
    setInternalLinks(prev => [...prev, { id: generateId('link'), anchor: '', url: '' }])
  }

  function updateInternalLink(id: string, field: 'anchor' | 'url', value: string) {
    setInternalLinks(prev => prev.map(link => (link.id === id ? { ...link, [field]: value } : link)))
  }

  function removeInternalLink(id: string) {
    setInternalLinks(prev => prev.filter(link => link.id !== id))
  }

  function validateForm() {
    const errors: ValidationErrors = {}
    if (!topic.trim()) errors.topic = 'Blog topic or keyword is required'
    if (!audience.trim()) errors.audience = 'Target audience is required'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleGenerate() {
    if (!validateForm()) return

    // Check credits before generating
    const creditCost = articleLength.value >= 2000 ? 15 : 8
    if (user.plan !== 'agency') {
      const remaining = user.credits.total - user.credits.used
      if (remaining < creditCost) {
        addNotification({ type: 'error', message: `Not enough credits. You need ${creditCost} but have ${remaining}. Upgrade your plan.` })
        return
      }
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current)
    }

    setCurrentLoadingLabel('Researching SEO...')
    loadingTimerRef.current = window.setTimeout(() => {
      setCurrentLoadingLabel('Writing article...')
    }, 1800)

    setOutputState('researching')
    setResearchData(null)
    setStreamedArticle('')
    setFinalArticle('')
    setEditableArticle('')
    setIsEditing(false)

    const quickAnswer = buildQuickAnswer(topic, audience)
    const research = buildMockResearch(topic, articleLength.value, secondaryKeywords, serpTarget)
    const article = buildMarkdownArticle({
      topic,
      audience,
      searchIntent,
      tone,
      articleLength: articleLength.value,
      secondaryKeywords,
      advancedOptions,
      internalLinks,
      quickAnswer,
    })

    try {
      // ── Fully offline generation (no backend required) ──
      // Phase 1: show researching state
      await new Promise(r => setTimeout(r, 1200))
      setResearchData(research)
      setOutputState('research-complete')

      // Phase 2: brief pause then start writing
      await new Promise(r => setTimeout(r, 600))
      setOutputState('writing')

      // Phase 3: typewriter stream the article
      let displayed = ''
      const chunkSize = 18
      for (let i = 0; i < article.length; i += chunkSize) {
        if (controller.signal.aborted) return
        displayed = article.slice(0, i + chunkSize)
        setStreamedArticle(displayed)
        await new Promise(r => setTimeout(r, 12))
      }
      setStreamedArticle(article)

      // Phase 4: finalise
      const words = article.split(/\s+/).filter(Boolean).length
      const analysis = calculateSeoAnalysis(article, research, advancedOptions, articleLength.value)
      setFinalArticle(article)
      setEditableArticle(article)
      setMetaInfo({
        words,
        readMinutes: Math.max(1, Math.ceil(words / 260)),
        score: analysis.score,
      })
      setOutputState('done')
      // Deduct credits on successful generation
      const creditCost = articleLength.value >= 2000 ? 15 : 8
      deductCredit(creditCost)
      addNotification({ type: 'success', message: `Article generated! ${creditCost} credits used.` })
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
      setOutputState('empty')
      setCurrentLoadingLabel('Researching SEO...')
      addNotification({ type: 'error', message: error instanceof Error ? error.message : 'Unable to generate article. Please try again.' })
    } finally {
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current)
      }
      abortRef.current = null
    }
  }

  function handleCopyMarkdown() {
    const value = isEditing ? editableArticle : finalArticle
    navigator.clipboard.writeText(value)
    toast.success('Copied!')
  }

  function handleDownloadTxt() {
    const text = getArticlePlainText(finalArticle)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    triggerFileDownload(blob, `${slugify(topic || 'blog-article')}.txt`)
  }

  function handleDownloadDocx() {
    const htmlDocument = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"></head>
<body>
${markdownToHtml(finalArticle)}
</body>
</html>`
    const blob = new Blob(['\ufeff', htmlDocument], { type: 'application/msword' })
    triggerFileDownload(blob, `${slugify(topic || 'blog-article')}.docx`)
  }

  function handleDownloadPdf() {
    window.print()
  }

  function handleSave() {
    toast.success('Saved to content library')
  }

  function handleCopySchema() {
    const schemaText = JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: topic,
        audience: audience,
        keywords: secondaryKeywords,
      },
      null,
      2
    )
    navigator.clipboard.writeText(schemaText)
    toast.success('Schema copied')
  }

  function triggerFileDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const articleViewerHtml = markdownToHtml(isEditing ? editableArticle : streamedArticle || finalArticle)
  const showOutputDrawer = outputState !== 'empty'

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="flex h-[calc(100vh-104px)] min-h-[720px] flex-col overflow-hidden rounded-[24px] border border-[#2A2A3A] bg-[#0D0D14] md:h-[calc(100vh-108px)] lg:grid lg:grid-cols-[45%_1px_55%]">
        <section className="flex min-h-0 flex-col bg-[#111118]">
          <div className="border-b border-[#2A2A3A] px-5 py-4">
            <div className="mb-3 flex items-center gap-1 text-[12px] text-[#9494B0]">
              <button onClick={() => navigate('/tools')} className="transition-colors hover:text-[#F0EFFF]">
                Tools
              </button>
              <span>›</span>
              <span>Content</span>
              <span>›</span>
              <span>Blog Writer</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C47FF] text-lg text-white shadow-[0_8px_24px_rgba(108,71,255,0.28)]">
                    ✍️
                  </div>
                  <h1 className="text-[18px] font-medium text-[#F0EFFF]">Blog Writer</h1>
                  <span className="rounded-full border border-[#6C47FF40] bg-[#6C47FF20] px-2.5 py-1 text-[11px] font-medium text-[#C4B5FD]">
                    AI Core
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-[#9494B0]">Full SEO articles in seconds</p>
              </div>

              <button
                onClick={handleFillExample}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#2A2A3A] bg-transparent px-3 py-2 text-[12px] font-medium text-[#C4B5FD] transition-colors hover:border-[#6C47FF40] hover:bg-[#161622]"
              >
                <Sparkles size={14} />
                Fill example
              </button>
            </div>
          </div>

          <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-5">
            <div className="space-y-5 pb-28">
              <FieldBlock
                label="Blog topic or keyword"
                required
                helper="This becomes your H1 and primary SEO keyword"
                error={validationErrors.topic}
              >
                <input
                  value={topic}
                  onChange={event => {
                    setTopic(event.target.value)
                    if (validationErrors.topic) {
                      setValidationErrors(prev => ({ ...prev, topic: undefined }))
                    }
                  }}
                  placeholder="e.g. Best email marketing strategies for SaaS"
                  className={cn(
                    'h-11 w-full rounded-xl border bg-[#1A1A24] px-3 text-sm text-[#F0EFFF] outline-none transition-all placeholder:text-[#5A5A78] focus:border-[#6C47FF] focus:shadow-[0_0_0_3px_rgba(108,71,255,0.12)]',
                    validationErrors.topic ? 'border-[#FF6B6B]' : 'border-[#2A2A3A]'
                  )}
                />
              </FieldBlock>

              <FieldBlock
                label="Secondary keywords"
                helper="Additional keywords you want this article to rank for"
              >
                <div className="rounded-xl border border-[#2A2A3A] bg-[#1A1A24] px-3 py-3">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {secondaryKeywords.map(keyword => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 rounded-full bg-[#6C47FF20] px-2.5 py-1 text-[12px] text-[#A78BFA]"
                      >
                        {keyword}
                        <button
                          onClick={() =>
                            setSecondaryKeywords(prev => prev.filter(item => item !== keyword))
                          }
                          className="text-[#C4B5FD] transition-colors hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    value={keywordInput}
                    onChange={event => setKeywordInput(event.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="Type keyword and press Enter"
                    className="w-full bg-transparent text-sm text-[#F0EFFF] outline-none placeholder:text-[#5A5A78]"
                  />
                  <div className="mt-2 text-[11px] text-[#5A5A78]">{secondaryKeywords.length}/10 tags</div>
                </div>
              </FieldBlock>

              <FieldBlock
                label="Target audience"
                required
                error={validationErrors.audience}
              >
                <input
                  value={audience}
                  onChange={event => {
                    setAudience(event.target.value)
                    if (validationErrors.audience) {
                      setValidationErrors(prev => ({ ...prev, audience: undefined }))
                    }
                  }}
                  placeholder="e.g. Marketing managers at SaaS companies"
                  className={cn(
                    'h-11 w-full rounded-xl border bg-[#1A1A24] px-3 text-sm text-[#F0EFFF] outline-none transition-all placeholder:text-[#5A5A78] focus:border-[#6C47FF] focus:shadow-[0_0_0_3px_rgba(108,71,255,0.12)]',
                    validationErrors.audience ? 'border-[#FF6B6B]' : 'border-[#2A2A3A]'
                  )}
                />
              </FieldBlock>

              <FieldBlock
                label="Search intent"
                required
                tooltip={SEARCH_INTENT_TOOLTIP}
              >
                <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                  {SEARCH_INTENTS.map(option => (
                    <TogglePill
                      key={option}
                      active={searchIntent === option}
                      onClick={() => setSearchIntent(option)}
                    >
                      {option}
                    </TogglePill>
                  ))}
                </div>
              </FieldBlock>

              <FieldBlock label="Tone of voice" required>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={event => setTone(event.target.value as ToneOption)}
                    className="h-11 w-full appearance-none rounded-xl border border-[#2A2A3A] bg-[#1A1A24] px-3 pr-10 text-sm text-[#F0EFFF] outline-none transition-all focus:border-[#6C47FF]"
                  >
                    {TONE_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9494B0]"
                  />
                </div>
              </FieldBlock>

              <FieldBlock
                label={`Article length — ${articleLength.label}`}
                required
              >
                <div className="rounded-xl border border-[#2A2A3A] bg-[#111118] px-3 py-4">
                  <input
                    type="range"
                    min={0}
                    max={LENGTH_OPTIONS.length - 1}
                    step={1}
                    value={lengthIndex}
                    onChange={event => setLengthIndex(Number(event.target.value))}
                    className="blog-range w-full"
                  />
                  <div className="mt-3 grid grid-cols-6 text-center text-[10px] text-[#5A5A78]">
                    {LENGTH_OPTIONS.map(option => (
                      <span key={option.value}>{option.value}w</span>
                    ))}
                  </div>
                </div>
              </FieldBlock>

              <FieldBlock label="Target Google SERP feature">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {SERP_OPTIONS.map(option => (
                    <TogglePill
                      key={option}
                      active={serpTarget === option}
                      onClick={() => setSerpTarget(option)}
                    >
                      {option}
                    </TogglePill>
                  ))}
                </div>
              </FieldBlock>

              <div className="rounded-2xl border border-[#2A2A3A] bg-[#111118]">
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    onClick={() => setLinksExpanded(prev => !prev)}
                    className="flex items-center gap-2 text-sm text-[#F0EFFF]"
                  >
                    <ChevronRight
                      size={14}
                      className={cn('transition-transform text-[#9494B0]', linksExpanded && 'rotate-90')}
                    />
                    <span>Internal links</span>
                    <span className="text-[12px] text-[#5A5A78]">
                      {internalLinks.length} links added
                    </span>
                  </button>
                  <button
                    onClick={addInternalLink}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#2A2A3A] px-2.5 py-1.5 text-[12px] text-[#C4B5FD] transition-colors hover:border-[#6C47FF40] hover:bg-[#161622]"
                  >
                    <Plus size={12} />
                    Add link
                  </button>
                </div>

                {linksExpanded && (
                  <div className="space-y-3 border-t border-[#2A2A3A] px-4 py-4">
                    {internalLinks.length === 0 && (
                      <div className="text-[12px] text-[#5A5A78]">No internal links added yet.</div>
                    )}

                    {internalLinks.map(link => (
                      <div key={link.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                        <input
                          value={link.anchor}
                          onChange={event => updateInternalLink(link.id, 'anchor', event.target.value)}
                          placeholder="Anchor text"
                          className="h-10 rounded-xl border border-[#2A2A3A] bg-[#1A1A24] px-3 text-sm text-[#F0EFFF] outline-none placeholder:text-[#5A5A78] focus:border-[#6C47FF]"
                        />
                        <input
                          value={link.url}
                          onChange={event => updateInternalLink(link.id, 'url', event.target.value)}
                          placeholder="URL"
                          className="h-10 rounded-xl border border-[#2A2A3A] bg-[#1A1A24] px-3 text-sm text-[#F0EFFF] outline-none placeholder:text-[#5A5A78] focus:border-[#6C47FF]"
                        />
                        <button
                          onClick={() => removeInternalLink(link.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2A2A3A] text-[#9494B0] transition-colors hover:border-[#FF6B6B40] hover:text-[#FF8C8C]"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#2A2A3A] bg-[#111118]">
                <button
                  onClick={() => setAdvancedExpanded(prev => !prev)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm text-[#F0EFFF]">Advanced SEO options</span>
                  <ChevronDown
                    size={16}
                    className={cn('text-[#9494B0] transition-transform', advancedExpanded && 'rotate-180')}
                  />
                </button>

                {advancedExpanded && (
                  <div className="grid gap-3 border-t border-[#2A2A3A] px-4 py-4 md:grid-cols-2">
                    <SeoSwitch
                      label="Target featured snippet"
                      checked={advancedOptions.targetFeaturedSnippet}
                      onChange={checked =>
                        setAdvancedOptions(prev => ({ ...prev, targetFeaturedSnippet: checked }))
                      }
                    />
                    <SeoSwitch
                      label="Include FAQ section"
                      checked={advancedOptions.includeFaq}
                      onChange={checked => setAdvancedOptions(prev => ({ ...prev, includeFaq: checked }))}
                    />
                    <SeoSwitch
                      label="Table of Contents"
                      checked={advancedOptions.tableOfContents}
                      onChange={checked =>
                        setAdvancedOptions(prev => ({ ...prev, tableOfContents: checked }))
                      }
                    />
                    <SeoSwitch
                      label="Include statistics & data"
                      checked={advancedOptions.includeStats}
                      onChange={checked => setAdvancedOptions(prev => ({ ...prev, includeStats: checked }))}
                    />
                    <SeoSwitch
                      label="Generate schema markup"
                      checked={advancedOptions.generateSchema}
                      onChange={checked =>
                        setAdvancedOptions(prev => ({ ...prev, generateSchema: checked }))
                      }
                    />
                    <SeoSwitch
                      label="Include expert quotes"
                      checked={advancedOptions.includeExpertQuotes}
                      onChange={checked =>
                        setAdvancedOptions(prev => ({ ...prev, includeExpertQuotes: checked }))
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-[#2A2A3A] bg-[#111118] px-5 py-4">
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[#2A2A3A] bg-[#14141C] px-3 py-3">
              <div className="flex items-center gap-2">
                <Mic size={14} className={cn(brandVoiceEnabled ? 'text-[#A78BFA]' : 'text-[#9494B0]')} />
                <div>
                  <div className={cn('text-[13px]', brandVoiceEnabled ? 'text-[#A78BFA]' : 'text-[#9494B0]')}>
                    Use my brand voice
                  </div>
                  {brandVoiceEnabled && (
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#7EE7A8]">
                      <span className="h-2 w-2 rounded-full bg-[#00D97E]" />
                      Brand voice active
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setBrandVoiceEnabled(prev => !prev)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  brandVoiceEnabled ? 'bg-[#6C47FF]' : 'bg-[#2A2A3A]'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                    brandVoiceEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                  )}
                />
              </button>
            </div>

            <button
              onClick={handleGenerate}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#6C47FF] text-[15px] font-medium text-white transition-colors hover:bg-[#4A2FD4]"
            >
              {outputState === 'researching' || outputState === 'research-complete' || outputState === 'writing' ? (
                <>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
                  </span>
                  {currentLoadingLabel}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  ✦ Generate Article
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[12px] text-[#5A5A78]">This will use ~{creditsEstimate} credits</p>
          </div>
        </section>

        <div className="hidden bg-[#2A2A3A] lg:block" />

        <section
          className={cn(
            'min-h-0 bg-[#0D0D14]',
            'hidden lg:flex lg:flex-col',
            showOutputDrawer && 'fixed inset-x-0 bottom-0 top-auto z-30 flex max-h-[82vh] flex-col rounded-t-[24px] border border-[#2A2A3A] bg-[#0D0D14] md:static md:max-h-none md:rounded-none md:border-0 lg:relative'
          )}
        >
          <div className="flex-1 overflow-y-auto">
            {outputState === 'empty' && (
              <div className="flex h-full min-h-[480px] flex-col items-center justify-center px-6 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-[24px] bg-[#6C47FF]/15 blur-2xl" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#2A2A3A] bg-[#1A1A24] text-[32px]">
                    ✍️
                  </div>
                </div>
                <h2 className="text-[18px] font-medium text-[#F0EFFF]">Your article will appear here</h2>
                <p className="mt-2 max-w-[280px] text-[13px] leading-6 text-[#9494B0]">
                  Fill in your topic and click Generate Article to create a full SEO blog post.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {['SEO optimised', 'Structured headings', 'Ready to publish'].map(item => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-[#2A2A3A] bg-[#1A1A24] px-3 py-2 text-[12px] text-[#9494B0]"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#00D97E]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(outputState === 'researching' || outputState === 'research-complete' || outputState === 'writing') && (
              <div className="px-5 py-6 md:px-6 lg:px-8">
                <div className="mx-auto max-w-[860px] space-y-5">
                  <div className="rounded-[12px] border border-[#2A2A3A] bg-[#111118] p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <LoaderCircle
                        size={20}
                        className="animate-spin text-[#A78BFA]"
                      />
                      <span className="text-[14px] text-[#A78BFA]">Analysing SEO landscape...</span>
                    </div>

                    {outputState === 'researching' && (
                      <div className="space-y-3">
                        {[0.95, 0.82, 0.9, 0.74].map((width, index) => (
                          <div
                            key={index}
                            className="h-3 animate-pulse rounded-full bg-gradient-to-r from-[#191924] via-[#26263B] to-[#191924]"
                            style={{ width: `${width * 100}%` }}
                          />
                        ))}
                      </div>
                    )}

                    {researchData && outputState !== 'researching' && (
                      <ResearchCard researchData={researchData} />
                    )}
                  </div>

                  {(outputState === 'writing' || outputState === 'research-complete') && (
                    <div className="rounded-[16px] border border-[#1B1B2B] bg-[#0D0D14] p-6">
                      <div className="mb-4 flex items-center gap-2 text-[14px] text-[#C4B5FD]">
                        <Sparkles size={15} />
                        <span>✦ Writing your article...</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A78BFA] [animation-delay:-0.2s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A78BFA] [animation-delay:-0.1s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#A78BFA]" />
                        </span>
                      </div>
                      <div
                        className="blog-article prose prose-invert max-w-none text-[16px] leading-[1.8] text-[#F0EFFF]"
                        dangerouslySetInnerHTML={{
                          __html: markdownToHtml(streamedArticle || finalArticle || buildMarkdownArticle({
                            topic,
                            audience,
                            searchIntent,
                            tone,
                            articleLength: articleLength.value,
                            secondaryKeywords,
                            advancedOptions,
                            internalLinks,
                            quickAnswer: buildQuickAnswer(topic, audience),
                          })),
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {outputState === 'done' && (
              <div className="px-5 py-5 md:px-6 lg:px-8">
                <div className="mx-auto max-w-[920px]">
                  <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-[#2A2A3A] pb-4">
                    <ToolbarButton icon={<Copy size={14} />} label="Copy" onClick={handleCopyMarkdown} />
                    <ToolbarButton icon={<Download size={14} />} label=".docx" onClick={handleDownloadDocx} />
                    <ToolbarButton icon={<Download size={14} />} label=".txt" onClick={handleDownloadTxt} />
                    <span className="mx-1 text-[#2A2A3A]">|</span>
                    <ToolbarButton icon={<RefreshCw size={14} />} label="Regenerate" onClick={handleGenerate} />
                    <ToolbarButton
                      icon={<Pencil size={14} />}
                      label="Edit"
                      onClick={() => setIsEditing(prev => !prev)}
                    />
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#6C47FF40] bg-[#6C47FF] px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#5A39EF]"
                    >
                      <Save size={14} />
                      Save
                    </button>
                  </div>

                  <SeoAnalysisCard seoAnalysis={seoAnalysis} onCopySchema={handleCopySchema} />

                  <div className="mt-5 rounded-[18px] border border-[#161624] bg-[#0D0D14] p-4 md:p-8">
                    <div className="mx-auto max-w-[680px]">
                      {isEditing ? (
                        <textarea
                          value={editableArticle}
                          onChange={event => {
                            setEditableArticle(event.target.value)
                            setFinalArticle(event.target.value)
                            setStreamedArticle(event.target.value)
                          }}
                          className="min-h-[780px] w-full resize-none rounded-2xl border border-[#2A2A3A] bg-[#111118] p-5 font-mono text-[14px] leading-7 text-[#E8E8F0] outline-none focus:border-[#6C47FF]"
                        />
                      ) : (
                        <>
                          <QuickAnswerCard answer={buildQuickAnswer(topic, audience)} />
                          <div
                            className="blog-article"
                            dangerouslySetInnerHTML={{ __html: articleViewerHtml }}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-[#5A5A78]">
                    <span>{metaInfo.words.toLocaleString()} words</span>
                    <span>·</span>
                    <span>{metaInfo.readMinutes} min read</span>
                    <span>·</span>
                    <span>SEO score {metaInfo.score}/100</span>
                    <span>·</span>
                    <span>Generated with GPT-4o</span>
                    <button
                      onClick={handleCopySchema}
                      className="ml-auto text-[#A78BFA] transition-colors hover:text-[#C4B5FD]"
                    >
                      Copy Schema
                    </button>
                    <button
                      onClick={handleDownloadPdf}
                      className="text-[#A78BFA] transition-colors hover:text-[#C4B5FD]"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={cn('lg:hidden', !showOutputDrawer && 'hidden')}>
          <div className="fixed inset-x-0 bottom-0 z-30 max-h-[82vh] rounded-t-[24px] border border-[#2A2A3A] bg-[#0D0D14] shadow-[0_-24px_48px_rgba(0,0,0,0.45)]">
            <div className="mx-auto mt-2 h-1.5 w-14 rounded-full bg-[#2A2A3A]" />
            <div className="max-h-[78vh] overflow-y-auto">
              {outputState === 'done' ? (
                <div className="px-4 py-4">
                  <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[#2A2A3A] pb-4">
                    <ToolbarButton icon={<Copy size={14} />} label="Copy" onClick={handleCopyMarkdown} />
                    <ToolbarButton icon={<RefreshCw size={14} />} label="Regenerate" onClick={handleGenerate} />
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#6C47FF40] bg-[#6C47FF] px-3 py-2 text-[12px] font-medium text-white"
                    >
                      <Save size={14} />
                      Save
                    </button>
                  </div>
                  <SeoAnalysisCard seoAnalysis={seoAnalysis} onCopySchema={handleCopySchema} compact />
                  <div className="mt-4 rounded-[18px] border border-[#161624] bg-[#0D0D14] p-4">
                    <QuickAnswerCard answer={buildQuickAnswer(topic, audience)} />
                    <div className="blog-article" dangerouslySetInnerHTML={{ __html: articleViewerHtml }} />
                  </div>
                </div>
              ) : (
                <div className="px-4 py-5">
                  {researchData ? <ResearchCard researchData={researchData} /> : null}
                  <div className="mt-4 rounded-[16px] border border-[#1B1B2B] bg-[#0D0D14] p-4">
                    <div className="mb-4 flex items-center gap-2 text-[14px] text-[#C4B5FD]">
                      <Sparkles size={15} />
                      <span>✦ Writing your article...</span>
                    </div>
                    <div
                      className="blog-article"
                      dangerouslySetInnerHTML={{
                        __html: markdownToHtml(streamedArticle || finalArticle || '## Writing in progress'),
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .blog-range {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            #6C47FF 0%,
            #6C47FF ${(lengthIndex / (LENGTH_OPTIONS.length - 1)) * 100}%,
            #2A2A3A ${(lengthIndex / (LENGTH_OPTIONS.length - 1)) * 100}%,
            #2A2A3A 100%
          );
          outline: none;
        }

        .blog-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #6C47FF;
          border: 0;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.18);
        }

        .blog-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #6C47FF;
          border: 0;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.18);
        }

        .blog-article {
          color: #E8E8F0;
          font-size: 16px;
          line-height: 1.8;
        }

        .blog-article h1 {
          font-size: 28px;
          line-height: 1.2;
          color: #F0EFFF;
          font-weight: 500;
          margin: 0 0 24px;
        }

        .blog-article h2 {
          font-size: 22px;
          line-height: 1.35;
          color: #F0EFFF;
          font-weight: 500;
          border-bottom: 1px solid #2A2A3A;
          padding-bottom: 8px;
          margin: 36px 0 18px;
        }

        .blog-article h3 {
          font-size: 18px;
          color: #D0D0E8;
          font-weight: 500;
          margin: 24px 0 12px;
        }

        .blog-article p {
          margin: 0 0 16px;
          color: #E8E8F0;
        }

        .blog-article strong {
          color: #F0EFFF;
          font-weight: 600;
        }

        .blog-article a {
          color: #A78BFA;
          text-decoration: none;
        }

        .blog-article a:hover {
          text-decoration: underline;
        }

        .blog-article ul,
        .blog-article ol {
          margin: 0 0 18px 0;
          padding-left: 20px;
        }

        .blog-article ul li,
        .blog-article ol li {
          margin-bottom: 8px;
          color: #E8E8F0;
        }

        .blog-article ul li::marker,
        .blog-article ol li::marker {
          color: #6C47FF;
        }

        .blog-article blockquote {
          margin: 18px 0;
          border-left: 3px solid #6C47FF;
          background: #1A1A24;
          padding: 16px;
          font-style: italic;
          color: #D0D0E8;
        }

        .blog-article pre {
          background: #0A0A12;
          border: 1px solid #2A2A3A;
          border-radius: 12px;
          padding: 16px;
          overflow: auto;
          margin: 18px 0;
        }

        .blog-article code {
          color: #A78BFA;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
      `}</style>
    </div>
  )
}

function calculateSeoAnalysis(
  article: string,
  researchData: ResearchData | null,
  advancedOptions: Record<SeoToggleKey, boolean>,
  articleLength: number
): SeoAnalysis {
  const wordCount = article.split(/\s+/).filter(Boolean).length
  const lsiCount = researchData?.lsiKeywords.length ?? 16
  const paaCount = researchData?.peopleAlsoAsk.length ?? 8
  let score = 74

  if (wordCount >= articleLength) score += 6
  if (advancedOptions.generateSchema) score += 3
  if (advancedOptions.includeFaq) score += 2
  if (advancedOptions.targetFeaturedSnippet) score += 2
  if (researchData?.keywordDifficulty === 'Medium') score += 0
  if (researchData?.keywordDifficulty === 'Low') score += 2
  if (wordCount >= articleLength * 1.1) score += 2

  score = Math.min(96, score)

  return {
    score,
    grade: score >= 90 ? 'A+' : score >= 85 ? 'A' : score >= 80 ? 'B+' : 'B',
    verdict: score >= 85 ? 'Excellent' : 'Strong',
    checks: [
      `16/16 LSI keywords covered`,
      `${paaCount}/${paaCount} PAA questions answered`,
      `${advancedOptions.targetFeaturedSnippet ? 'Featured snippet optimised' : 'Snippet target reviewed'}`,
      `${wordCount.toLocaleString()} words · ${wordCount >= articleLength ? 'above benchmark' : 'near benchmark'}`,
      `${advancedOptions.generateSchema ? 'Schema markup generated' : 'Schema markup skipped'}`,
    ],
    warning: 'Add more external citations for stronger E-E-A-T',
  }
}

function FieldBlock({
  label,
  helper,
  children,
  required,
  tooltip,
  error,
}: {
  label: string
  helper?: string
  children: React.ReactNode
  required?: boolean
  tooltip?: string
  error?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-[13px] text-[#F0EFFF]">
          {label} {required && <span className="text-[#FF8C8C]">*</span>}
        </label>
        {tooltip && (
          <div className="group relative">
            <Info size={13} className="text-[#9494B0]" />
            <div className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 hidden w-64 -translate-x-1/2 rounded-xl border border-[#2A2A3A] bg-[#111118] p-3 text-[11px] leading-5 text-[#9494B0] shadow-xl group-hover:block">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      {children}
      {error ? (
        <div className="text-[12px] text-[#FF8C8C]">{error}</div>
      ) : helper ? (
        <div className="text-[12px] text-[#5A5A78]">{helper}</div>
      ) : null}
    </div>
  )
}

function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-2 text-[12px] font-medium transition-colors',
        active
          ? 'border-[#6C47FF] bg-[#6C47FF] text-white'
          : 'border-[#2A2A3A] bg-[#1A1A24] text-[#9494B0] hover:text-[#F0EFFF]'
      )}
    >
      {children}
    </button>
  )
}

function SeoSwitch({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#2A2A3A] bg-[#14141C] px-3 py-3">
      <span className="text-[12px] text-[#9494B0]">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-10 rounded-full transition-colors',
          checked ? 'bg-[#6C47FF]' : 'bg-[#2A2A3A]'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
          )}
        />
      </button>
    </div>
  )
}

function ResearchCard({ researchData }: { researchData: ResearchData }) {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.07em] text-[#5A5A78]">SEO RESEARCH COMPLETE</div>
          <div className="mt-1 h-px bg-[#2A2A3A]" />
        </div>
        <div className="text-[#7EE7A8]">✅</div>
      </div>

      <div className="grid gap-2 text-[13px] text-[#F0EFFF]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.07em] text-[#5A5A78]">Keyword difficulty</span>
          <span className="rounded-full bg-[#FFB54720] px-2 py-1 text-[11px] text-[#FFB547]">
            {researchData.keywordDifficulty} — amber badge
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.07em] text-[#5A5A78]">Target word count</span>
          <span>{researchData.targetWordCount.toLocaleString()} words</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] uppercase tracking-[0.07em] text-[#5A5A78]">Featured snippet</span>
          <span>{researchData.featuredSnippet}</span>
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.07em] text-[#5A5A78]">
          LSI Keywords ({researchData.lsiKeywords.length} found)
        </div>
        <div className="flex flex-wrap gap-2">
          {researchData.lsiKeywords.slice(0, 7).map(keyword => (
            <span
              key={keyword}
              className="rounded-lg border border-[#2A2A3A] bg-[#1A1A24] px-2 py-1 text-[11px] text-[#9494B0]"
            >
              {keyword}
            </span>
          ))}
          {researchData.lsiKeywords.length > 7 && (
            <span className="rounded-lg border border-[#2A2A3A] bg-[#1A1A24] px-2 py-1 text-[11px] text-[#9494B0]">
              +{researchData.lsiKeywords.length - 7}
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.07em] text-[#5A5A78]">
          People Also Ask ({researchData.peopleAlsoAsk.length} questions)
        </div>
        <div className="space-y-1.5 text-[13px] text-[#F0EFFF]">
          {researchData.peopleAlsoAsk.slice(0, 3).map(question => (
            <div key={question}>• {question}</div>
          ))}
          {researchData.peopleAlsoAsk.length > 3 && (
            <div className="text-[#9494B0]">show +{researchData.peopleAlsoAsk.length - 3} more</div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.07em] text-[#5A5A78]">
          Content gaps vs competitors
        </div>
        <div className="space-y-1.5 text-[13px] text-[#F0EFFF]">
          {researchData.contentGaps.map(item => (
            <div key={item}>• {item}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A3A] px-3 py-2 text-[12px] text-[#9494B0] transition-colors hover:bg-[#171722] hover:text-[#F0EFFF]"
    >
      {icon}
      {label}
    </button>
  )
}

function SeoAnalysisCard({
  seoAnalysis,
  onCopySchema,
  compact = false,
}: {
  seoAnalysis: SeoAnalysis
  onCopySchema: () => void
  compact?: boolean
}) {
  const radius = compact ? 30 : 42
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (seoAnalysis.score / 100) * circumference

  return (
    <div className="rounded-[16px] border border-[#2A2A3A] bg-[#111118] p-4 md:p-5">
      <div className="mb-4 text-[12px] uppercase tracking-[0.08em] text-[#9494B0]">SEO ANALYSIS</div>
      <div className={cn('grid gap-5', compact ? 'grid-cols-1' : 'lg:grid-cols-[180px_1fr]')}>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative flex h-[110px] w-[110px] items-center justify-center">
            <svg width="110" height="110" className="-rotate-90">
              <circle cx="55" cy="55" r={radius} stroke="#232338" strokeWidth="10" fill="none" />
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="#6C47FF"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-[22px] font-medium text-[#F0EFFF]">{seoAnalysis.score}</div>
              <div className="text-[11px] text-[#5A5A78]">/100</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[32px] font-medium leading-none text-[#F0EFFF]">{seoAnalysis.grade}</div>
            <div className="mt-1 text-[13px] text-[#9494B0]">{seoAnalysis.verdict}</div>
          </div>
        </div>

        <div className="space-y-3">
          {seoAnalysis.checks.map(item => (
            <div key={item} className="flex items-start gap-3 text-[14px] text-[#9494B0]">
              <span className="text-[#00D97E]">✅</span>
              <span>{item}</span>
            </div>
          ))}
          <div className="flex items-start gap-3 text-[14px] text-[#9494B0]">
            <span className="text-[#FFB547]">⚠️</span>
            <span>{seoAnalysis.warning}</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={onCopySchema}
              className="rounded-lg border border-[#2A2A3A] px-3 py-2 text-[12px] text-[#A78BFA] transition-colors hover:bg-[#171722]"
            >
              Copy Schema JSON
            </button>
            <button className="rounded-lg border border-[#2A2A3A] px-3 py-2 text-[12px] text-[#9494B0] transition-colors hover:bg-[#171722] hover:text-[#F0EFFF]">
              View full SEO breakdown
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAnswerCard({ answer }: { answer: string }) {
  return (
    <div className="mb-6 rounded-[14px] border-l-[3px] border-l-[#6C47FF40] bg-[#6C47FF15] p-4">
      <div className="mb-2 text-[12px] font-medium tracking-[0.08em] text-[#A78BFA]">⭐ QUICK ANSWER</div>
      <div className="border-t border-[#6C47FF30] pt-3 text-[15px] leading-7 text-[#D0D0E8]">{answer}</div>
    </div>
  )
}
