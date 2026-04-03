import { useState } from 'react'
import { Search, Bookmark, BookmarkCheck, Sparkles, TrendingUp, Clock, ExternalLink, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const CATEGORIES = ['All', 'SEO', 'Google Ads', 'Meta Ads', 'AI Marketing', 'Social Media', 'E-commerce', 'Content', 'Email']

const MOCK_NEWS = [
  {
    id: '1', category: 'SEO', title: 'Google Confirms Core Algorithm Update Rolling Out — What Marketers Need to Know',
    source: 'Search Engine Journal', time: '2 hours ago', thumbnail: '🔍',
    summary: 'Google has confirmed a broad core algorithm update is now rolling out. Early data shows significant ranking shifts across multiple verticals.',
    url: '#', trending: true,
  },
  {
    id: '2', category: 'AI Marketing', title: 'OpenAI Launches New Marketing API Features for Businesses',
    source: 'Marketing Week', time: '4 hours ago', thumbnail: '🤖',
    summary: 'OpenAI has released new API capabilities specifically designed for marketing automation, including improved brand voice consistency.',
    url: '#', trending: true,
  },
  {
    id: '3', category: 'Meta Ads', title: 'Meta Ads Performance Benchmarks Q3 2025 — Industry Report',
    source: 'HubSpot', time: '6 hours ago', thumbnail: '📣',
    summary: 'New benchmarks show average CPM up 12% YoY but conversion rates improving across e-commerce verticals.',
    url: '#', trending: false,
  },
  {
    id: '4', category: 'Content', title: '7 Content Marketing Trends Dominating 2025',
    source: 'Neil Patel', time: '8 hours ago', thumbnail: '✍️',
    summary: 'Short-form video, AI-assisted writing, and interactive content are the top three trends reshaping content strategy.',
    url: '#', trending: false,
  },
  {
    id: '5', category: 'Email', title: 'Email Open Rates Hit 5-Year High — New Data from Mailchimp',
    source: 'Moz', time: '10 hours ago', thumbnail: '📧',
    summary: 'Average email open rates reached 28.4% in Q2 2025, the highest since 2020, driven by improved personalisation.',
    url: '#', trending: true,
  },
  {
    id: '6', category: 'Google Ads', title: 'Google Performance Max Gets New Audience Insights Dashboard',
    source: 'Search Engine Journal', time: '12 hours ago', thumbnail: '🎯',
    summary: 'Advertisers can now see detailed audience breakdowns within Performance Max campaigns for the first time.',
    url: '#', trending: false,
  },
  {
    id: '7', category: 'Social Media', title: 'TikTok Launches New B2B Marketing Suite for Brands',
    source: 'Marketing Week', time: '1 day ago', thumbnail: '🎵',
    summary: 'TikTok for Business now includes lead generation forms, CRM integrations, and a dedicated B2B content format.',
    url: '#', trending: false,
  },
  {
    id: '8', category: 'E-commerce', title: 'Shopify Reports 40% Increase in AI-Powered Store Conversions',
    source: 'HubSpot', time: '1 day ago', thumbnail: '🛍️',
    summary: 'Merchants using Shopify\'s AI product recommendations are seeing 40% higher conversion rates on average.',
    url: '#', trending: false,
  },
]

const TRENDING_TOPICS = [
  { topic: 'Google Core Update', count: 1240 },
  { topic: 'AI Content Generation', count: 980 },
  { topic: 'Meta Ads CPM', count: 756 },
  { topic: 'Email Personalisation', count: 634 },
  { topic: 'TikTok B2B', count: 521 },
  { topic: 'Performance Max', count: 489 },
  { topic: 'SEO 2025', count: 412 },
]

const DAILY_DIGEST = [
  'Google core update rolling out — monitor rankings closely',
  'Meta CPM up 12% — adjust budgets for Q4 planning',
  'Email open rates at 5-year high — great time to invest in email',
  'TikTok B2B suite launched — early adopters have advantage',
  'AI content tools improving brand voice consistency significantly',
]

const categoryColor: Record<string, string> = {
  SEO: 'text-[#00D97E] bg-[#00D97E15] border-[#00D97E30]',
  'Google Ads': 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]',
  'Meta Ads': 'text-[#00C8FF] bg-[#00C8FF15] border-[#00C8FF30]',
  'AI Marketing': 'text-[#A78BFA] bg-[#6C47FF15] border-[#6C47FF30]',
  'Social Media': 'text-[#FF6B9D] bg-[#FF6B9D15] border-[#FF6B9D30]',
  'E-commerce': 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]',
  Content: 'text-[#00C8FF] bg-[#00C8FF15] border-[#00C8FF30]',
  Email: 'text-[#00D97E] bg-[#00D97E15] border-[#00D97E30]',
}

export default function NewsHub() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [summaries, setSummaries] = useState<Record<string, string[]>>({})
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null)

  const filtered = MOCK_NEWS.filter(n =>
    (activeCategory === 'All' || n.category === activeCategory) &&
    (n.title.toLowerCase().includes(search.toLowerCase()) || n.source.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleBookmark = (id: string) =>
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])

  const generateSummary = async (id: string, title: string) => {
    setLoadingSummary(id)
    await new Promise(r => setTimeout(r, 1200))
    setSummaries(prev => ({
      ...prev,
      [id]: [
        `Key insight: ${title.split('—')[0].trim()} represents a major shift in the industry`,
        'Action required: Review your current strategy and adjust within the next 30 days',
        'Opportunity: Early movers who adapt now will gain significant competitive advantage',
      ],
    }))
    setLoadingSummary(null)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">News Hub</h1>
          <p className="text-[#9494B0] text-sm">Real-time marketing news, curated for you.</p>
        </div>
        <Button variant="ghost" size="sm">
          <RefreshCw size={14} /> Refresh feed
        </Button>
      </div>

      {/* Daily Digest */}
      <div className="bg-gradient-to-r from-[#6C47FF15] to-[#00C8FF10] border border-[#6C47FF30] rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#A78BFA]" />
          <span className="font-semibold text-sm text-[#F0EFFF]">Today's AI Digest</span>
          <span className="text-xs text-[#5A5A78] ml-auto">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        <ul className="space-y-1.5">
          {DAILY_DIGEST.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#9494B0]">
              <span className="text-[#6C47FF] font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main feed */}
        <div>
          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search news..."
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  activeCategory === cat ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0] hover:border-[#3D3D55]'
                )}>
                {cat}
              </button>
            ))}
          </div>

          {/* News cards */}
          <div className="space-y-4">
            {filtered.map(article => (
              <div key={article.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 card-glow transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A24] flex items-center justify-center text-2xl flex-shrink-0">
                    {article.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', categoryColor[article.category] || 'text-[#9494B0] bg-[#1A1A24] border-[#2A2A3A]')}>
                        {article.category}
                      </span>
                      {article.trending && (
                        <span className="text-[10px] text-[#FFB547] bg-[#FFB54715] border border-[#FFB54730] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <TrendingUp size={9} /> Trending
                        </span>
                      )}
                      <span className="text-xs text-[#5A5A78] flex items-center gap-1 ml-auto">
                        <Clock size={11} /> {article.time}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#F0EFFF] text-sm mb-1 leading-snug">{article.title}</h3>
                    <p className="text-xs text-[#9494B0] mb-3 leading-relaxed">{article.summary}</p>

                    {/* AI Summary */}
                    {summaries[article.id] && (
                      <div className="bg-[#6C47FF10] border border-[#6C47FF30] rounded-lg p-3 mb-3">
                        <div className="text-[10px] text-[#A78BFA] font-medium mb-2 uppercase tracking-wide">AI Summary</div>
                        <ul className="space-y-1">
                          {summaries[article.id].map((s, i) => (
                            <li key={i} className="text-xs text-[#9494B0] flex items-start gap-1.5">
                              <span className="text-[#6C47FF] mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-[#5A5A78]">{article.source}</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => generateSummary(article.id, article.title)}
                          disabled={loadingSummary === article.id}
                          className="flex items-center gap-1 text-xs text-[#A78BFA] hover:text-[#6C47FF] transition-colors disabled:opacity-50"
                        >
                          <Sparkles size={12} />
                          {loadingSummary === article.id ? 'Summarising...' : summaries[article.id] ? 'Regenerate' : 'AI Summary'}
                        </button>
                        <button onClick={() => toggleBookmark(article.id)} className="text-[#5A5A78] hover:text-[#FFB547] transition-colors">
                          {bookmarks.includes(article.id) ? <BookmarkCheck size={15} className="text-[#FFB547]" /> : <Bookmark size={15} />}
                        </button>
                        <a href={article.url} className="text-[#5A5A78] hover:text-[#F0EFFF] transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Trending topics */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-[#6C47FF]" />
              <h3 className="font-semibold text-sm text-[#F0EFFF]">Trending Topics</h3>
            </div>
            <div className="space-y-2">
              {TRENDING_TOPICS.map((t, i) => (
                <div key={t.topic} className="flex items-center justify-between cursor-pointer hover:bg-[#1A1A24] rounded-lg px-2 py-1.5 transition-colors"
                  onClick={() => setSearch(t.topic)}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5A5A78] w-4">{i + 1}</span>
                    <span className="text-sm text-[#9494B0]">{t.topic}</span>
                  </div>
                  <span className="text-xs text-[#5A5A78]">{t.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bookmark size={16} className="text-[#FFB547]" />
              <h3 className="font-semibold text-sm text-[#F0EFFF]">Saved Articles</h3>
              <span className="ml-auto text-xs bg-[#FFB54720] text-[#FFB547] border border-[#FFB54740] px-2 py-0.5 rounded-full">{bookmarks.length}</span>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-xs text-[#5A5A78] text-center py-4">No saved articles yet.<br />Click the bookmark icon to save.</p>
            ) : (
              <div className="space-y-2">
                {MOCK_NEWS.filter(n => bookmarks.includes(n.id)).map(n => (
                  <div key={n.id} className="text-xs text-[#9494B0] hover:text-[#F0EFFF] cursor-pointer transition-colors leading-snug">
                    {n.title.slice(0, 60)}...
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sources */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">News Sources</h3>
            <div className="space-y-2">
              {['Search Engine Journal', 'Moz', 'Neil Patel', 'HubSpot', 'Marketing Week'].map(s => (
                <div key={s} className="flex items-center justify-between">
                  <span className="text-xs text-[#9494B0]">{s}</span>
                  <span className="w-2 h-2 rounded-full bg-[#00D97E]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
