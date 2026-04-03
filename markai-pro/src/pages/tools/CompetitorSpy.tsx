import { useState } from 'react'
import { Search, Globe, TrendingUp, MessageSquare, BarChart2, Lightbulb } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { sleep } from '../../lib/utils'

const mockResults = {
  name: 'Jasper AI',
  tagline: 'AI writing assistant for teams',
  audience: 'Enterprise marketing teams',
  messaging: {
    positioning: 'Enterprise-grade AI writing platform for large teams',
    keyMessages: ['Team collaboration', 'Brand consistency at scale', 'Workflow integrations'],
    emotionalTriggers: ['Fear of inconsistency', 'Desire for efficiency', 'Team alignment'],
  },
  content: {
    frequency: '4-5 posts/week',
    topTypes: ['Case studies', 'How-to guides', 'Product updates'],
    bestPerforming: 'Long-form LinkedIn articles (avg 2.3k impressions)',
  },
  keywords: [
    { kw: 'ai content creation', vol: '18,100', gap: true },
    { kw: 'marketing automation tools', vol: '12,400', gap: true },
    { kw: 'brand voice consistency', vol: '8,200', gap: false },
    { kw: 'ai copywriting software', vol: '6,600', gap: true },
    { kw: 'content workflow management', vol: '4,400', gap: false },
  ],
  counterStrategy: [
    'Position on affordability — Jasper charges $99+/mo for similar features',
    'Highlight all-in-one value — they require 3+ integrations for what you do natively',
    'Target their "team" messaging gap — solo marketers and freelancers are underserved',
    'Emphasise campaign workflow — Jasper has no campaign builder feature',
  ],
}

export default function CompetitorSpy() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<typeof mockResults | null>(null)

  const analyse = async () => {
    if (!url) return
    setLoading(true)
    await sleep(2500)
    setLoading(false)
    setResults(mockResults)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🕵️</span>
          <h1 className="font-display font-bold text-3xl">Competitor Spy Tool</h1>
          <span className="px-2 py-0.5 rounded-full bg-[#FFB54720] text-[#FFB547] border border-[#FFB54740] text-xs font-medium">Money Feature</span>
        </div>
        <p className="text-[#9494B0]">Enter a competitor's URL to uncover their strategy, gaps, and how to beat them.</p>
      </div>

      {/* Input */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
            <input
              value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://competitor.com"
              className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] placeholder-[#5A5A78] text-sm focus:outline-none focus:border-[#6C47FF] focus:shadow-[0_0_0_3px_#6C47FF20] transition-all"
            />
          </div>
          <Button size="lg" onClick={analyse} disabled={loading || !url}>
            {loading ? <><span className="animate-spin">⟳</span> Analysing...</> : <><Search size={16} /> Analyse</>}
          </Button>
        </div>
        {loading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#9494B0]">
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
              Scanning competitor website and social profiles...
            </div>
            <div className="h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
              <div className="h-full bg-[#6C47FF] rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-gradient-to-r from-[#6C47FF15] to-[#00C8FF10] border border-[#6C47FF30] rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A1A24] flex items-center justify-center text-2xl">🤖</div>
            <div>
              <h2 className="font-bold text-lg text-[#F0EFFF]">{results.name}</h2>
              <p className="text-sm text-[#9494B0]">{results.tagline}</p>
              <p className="text-xs text-[#5A5A78] mt-0.5">Target audience: {results.audience}</p>
            </div>
          </div>

          {/* 4 insight cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Messaging */}
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-[#6C47FF]" />
                <h3 className="font-semibold text-[#F0EFFF]">Messaging Analysis</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#5A5A78] mb-1">Core positioning</div>
                  <p className="text-sm text-[#9494B0]">{results.messaging.positioning}</p>
                </div>
                <div>
                  <div className="text-xs text-[#5A5A78] mb-1">Key messages</div>
                  <div className="flex flex-wrap gap-1">
                    {results.messaging.keyMessages.map(m => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A24] border border-[#2A2A3A] text-[#9494B0]">{m}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#5A5A78] mb-1">Emotional triggers</div>
                  <div className="flex flex-wrap gap-1">
                    {results.messaging.emotionalTriggers.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#FFB54710] border border-[#FFB54730] text-[#FFB547]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Strategy */}
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={18} className="text-[#00C8FF]" />
                <h3 className="font-semibold text-[#F0EFFF]">Content Strategy</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A24]">
                  <span className="text-xs text-[#9494B0]">Posting frequency</span>
                  <span className="text-xs font-medium text-[#F0EFFF]">{results.content.frequency}</span>
                </div>
                <div>
                  <div className="text-xs text-[#5A5A78] mb-1">Top content types</div>
                  <div className="space-y-1">
                    {results.content.topTypes.map(t => (
                      <div key={t} className="flex items-center gap-2 text-xs text-[#9494B0]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00C8FF]" /> {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#00D97E10] border border-[#00D97E30]">
                  <div className="text-xs text-[#00D97E] font-medium mb-0.5">Best performing</div>
                  <div className="text-xs text-[#9494B0]">{results.content.bestPerforming}</div>
                </div>
              </div>
            </div>

            {/* Keyword Gaps */}
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-[#00D97E]" />
                <h3 className="font-semibold text-[#F0EFFF]">Keyword Gaps</h3>
              </div>
              <div className="space-y-2">
                {results.keywords.map(k => (
                  <div key={k.kw} className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A24]">
                    <span className="text-xs text-[#9494B0]">{k.kw}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#5A5A78]">{k.vol}/mo</span>
                      {k.gap && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FF6B6B20] text-[#FF6B6B] border border-[#FF6B6B40]">Gap</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Counter Strategy */}
            <div className="bg-[#111118] border border-[#6C47FF30] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-[#FFB547]" />
                <h3 className="font-semibold text-[#F0EFFF]">Your Counter-Strategy</h3>
              </div>
              <div className="space-y-2">
                {results.counterStrategy.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#9494B0]">
                    <span className="text-[#6C47FF] font-bold mt-0.5">{i + 1}.</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full">
            ✨ Generate counter-messaging content
          </Button>
        </div>
      )}
    </div>
  )
}
