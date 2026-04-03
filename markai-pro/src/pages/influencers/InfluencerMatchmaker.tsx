import { useState } from 'react'
import { Users, Star, TrendingUp, Copy, Check, Wand2, ExternalLink, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'

const NICHES = ['Fashion & Beauty', 'Fitness & Health', 'Tech & SaaS', 'Food & Beverage', 'Travel', 'Finance', 'Education', 'Gaming', 'Lifestyle', 'B2B/Marketing']
const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter/X']
const BUDGETS = ['Under $500', '$500–$2,000', '$2,000–$10,000', '$10,000+']

const MOCK_INFLUENCERS = [
  { id: '1', name: 'Sarah Marketing', handle: '@sarahmarketing', platform: 'Instagram', followers: '124K', engagement: '4.8%', fakeScore: 12, niche: 'Marketing', avgViews: '18K', roi: '3.2×', price: '$800–$1,500', avatar: '👩‍💼', verified: true },
  { id: '2', name: 'TechTom', handle: '@techtomlive', platform: 'YouTube', followers: '89K', engagement: '6.2%', fakeScore: 8, niche: 'Tech & SaaS', avgViews: '24K', roi: '4.1×', price: '$1,200–$2,500', avatar: '👨‍💻', verified: true },
  { id: '3', name: 'GrowthGuru', handle: '@growthguru', platform: 'LinkedIn', followers: '45K', engagement: '8.4%', fakeScore: 5, niche: 'B2B/Marketing', avgViews: '12K', roi: '5.8×', price: '$600–$1,200', avatar: '🧑‍🏫', verified: false },
  { id: '4', name: 'ViralVicky', handle: '@viralvicky', platform: 'TikTok', followers: '312K', engagement: '9.1%', fakeScore: 22, niche: 'Lifestyle', avgViews: '85K', roi: '2.8×', price: '$1,500–$3,000', avatar: '👩‍🎤', verified: true },
  { id: '5', name: 'BizBrenda', handle: '@bizbrenda', platform: 'Instagram', followers: '67K', engagement: '5.6%', fakeScore: 9, niche: 'Finance', avgViews: '14K', roi: '3.9×', price: '$700–$1,400', avatar: '👩‍💰', verified: false },
]

function generateOutreach(influencer: typeof MOCK_INFLUENCERS[0], brand: string, niche: string): string {
  return `Hi ${influencer.name.split(' ')[0]},

I've been following your content on ${influencer.platform} for a while — your ${niche} content consistently delivers real value to your audience.

I'm reaching out from ${brand || '[Your Brand]'} because I think there's a genuine fit between what you create and what we offer.

**What we're proposing:**
- A sponsored post/video featuring our product in your authentic style
- Full creative freedom — you know your audience best
- Compensation: ${influencer.price} (negotiable based on deliverables)
- No rigid scripts — just honest, natural integration

**Why we think you're the right fit:**
Your ${influencer.engagement} engagement rate tells us your audience actually listens to you. That's rare and exactly what we're looking for.

Would you be open to a quick 15-minute call this week to explore if this makes sense for both of us?

Best,
[Your Name]
[Your Brand]`
}

export default function InfluencerMatchmaker() {
  const [niche, setNiche] = useState('Tech & SaaS')
  const [platform, setPlatform] = useState('Instagram')
  const [budget, setBudget] = useState('$500–$2,000')
  const [brand, setBrand] = useState('')
  const [results, setResults] = useState<typeof MOCK_INFLUENCERS | null>(null)
  const [loading, setLoading] = useState(false)
  const [outreach, setOutreach] = useState<{ influencer: typeof MOCK_INFLUENCERS[0]; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const find = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setResults(MOCK_INFLUENCERS.filter(i => i.platform === platform || Math.random() > 0.3))
    setLoading(false)
  }

  const fakeScoreColor = (s: number) => s < 10 ? 'text-[#00D97E]' : s < 20 ? 'text-[#FFB547]' : 'text-[#FF6B6B]'
  const fakeScoreLabel = (s: number) => s < 10 ? 'Authentic' : s < 20 ? 'Moderate' : 'High Risk'

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Influencer Matchmaker</h1>
        <p className="text-[#9494B0] text-sm">Find authentic influencers, check fake followers, predict ROI, and generate outreach.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Filters */}
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 space-y-4 h-fit">
          <h3 className="font-semibold text-[#F0EFFF]">Find Influencers</h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Your brand name</label>
            <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. MarkAI Pro"
              className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] placeholder-[#5A5A78] text-sm focus:outline-none focus:border-[#6C47FF] transition-all" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Niche</label>
            <select value={niche} onChange={e => setNiche(e.target.value)} className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
              {NICHES.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Platform</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    platform === p ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9494B0]')}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Budget per campaign</label>
            <div className="space-y-1">
              {BUDGETS.map(b => (
                <button key={b} onClick={() => setBudget(b)}
                  className={cn('w-full text-left px-3 py-2 rounded-lg text-xs border transition-all',
                    budget === b ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9494B0]')}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          <Button size="xl" onClick={find} disabled={loading}>
            {loading ? '⟳ Finding matches...' : <><Users size={16} /> Find Influencers</>}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!results && !loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-semibold text-[#F0EFFF] mb-2">Set your criteria and find matched influencers</h3>
              <p className="text-sm text-[#9494B0]">We check fake followers, engagement authenticity, and predict ROI for each match.</p>
            </div>
          )}

          {loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="flex gap-1.5 justify-center mb-4">
                {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
              <p className="text-[#9494B0]">Scanning influencer database and checking authenticity...</p>
            </div>
          )}

          {results && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#9494B0]">{results.length} influencers matched</span>
                <span className="text-xs text-[#5A5A78]">Sorted by ROI potential</span>
              </div>
              {results.map(inf => (
                <div key={inf.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 card-glow transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A1A24] flex items-center justify-center text-2xl flex-shrink-0">{inf.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[#F0EFFF]">{inf.name}</h3>
                            {inf.verified && <span className="text-[10px] text-[#00C8FF] bg-[#00C8FF15] border border-[#00C8FF30] px-1.5 py-0.5 rounded-full">✓ Verified</span>}
                          </div>
                          <p className="text-xs text-[#5A5A78]">{inf.handle} · {inf.platform}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-[#00D97E] text-sm">{inf.roi} ROI</div>
                          <div className="text-xs text-[#5A5A78]">{inf.price}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-3">
                        {[
                          { label: 'Followers', value: inf.followers },
                          { label: 'Engagement', value: inf.engagement },
                          { label: 'Avg Views', value: inf.avgViews },
                          { label: 'Fake Score', value: `${inf.fakeScore}%` },
                        ].map(m => (
                          <div key={m.label} className="bg-[#1A1A24] rounded-lg p-2 text-center">
                            <div className={cn('font-mono font-bold text-sm', m.label === 'Fake Score' ? fakeScoreColor(inf.fakeScore) : 'text-[#F0EFFF]')}>{m.value}</div>
                            <div className="text-[10px] text-[#5A5A78]">{m.label}</div>
                          </div>
                        ))}
                      </div>

                      {inf.fakeScore >= 20 && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FF6B6B10] border border-[#FF6B6B30] mb-3">
                          <AlertTriangle size={12} className="text-[#FF6B6B]" />
                          <span className="text-xs text-[#FF6B6B]">High fake follower risk — verify before committing budget</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setOutreach({ influencer: inf, text: generateOutreach(inf, brand, niche) })}>
                          <Wand2 size={12} /> Generate Outreach
                        </Button>
                        <Button size="sm">
                          View Profile <ExternalLink size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Outreach modal */}
      {outreach && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOutreach(null)}>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-hide" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#F0EFFF]">Outreach Message — {outreach.influencer.name}</h3>
              <button onClick={() => setOutreach(null)} className="text-[#5A5A78] hover:text-[#F0EFFF] text-xl">×</button>
            </div>
            <div className="bg-[#0D0D14] border border-[#2A2A3A] rounded-xl p-4 text-sm text-[#9494B0] leading-relaxed whitespace-pre-wrap mb-4">
              {outreach.text}
            </div>
            <Button className="w-full" onClick={() => { navigator.clipboard.writeText(outreach.text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
              {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy message</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
