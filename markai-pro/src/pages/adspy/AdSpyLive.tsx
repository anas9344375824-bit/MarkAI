import { useState } from 'react'
import { Search, Eye, Clock, TrendingUp, Wand2, ExternalLink, Copy, Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const MOCK_ADS = [
  { id: '1', platform: 'Google Ads', headline: 'AI Marketing Tools — Free Trial', description: 'Generate 10x more content in half the time. Trusted by 50,000+ marketers. Start free today.', cta: 'Start Free Trial', age: '47 days', status: 'Active', spend: '$8,400', impressions: '124K', ctr: '4.2%', angle: 'Free trial + social proof + time saving', offer: 'Free trial with no credit card' },
  { id: '2', platform: 'Meta Ads', headline: 'Stop Wasting Money on Bad Ads', description: 'Our AI writes ads that actually convert. See results in 24 hours or your money back.', cta: 'Get Started', age: '23 days', status: 'Active', spend: '$5,200', impressions: '89K', ctr: '3.8%', angle: 'Pain point + guarantee + speed', offer: 'Money-back guarantee' },
  { id: '3', platform: 'Google Ads', headline: 'Marketing AI for Agencies', description: 'Manage 10 clients with the work of 1. White-label reports, campaign builder, brand voice AI.', cta: 'Book Demo', age: '91 days', status: 'Active', spend: '$15,600', impressions: '210K', ctr: '5.1%', angle: 'Agency-specific + efficiency + features', offer: 'Demo booking (high intent)' },
  { id: '4', platform: 'LinkedIn Ads', headline: 'Your AI Marketing Team — $49/mo', description: 'Replace 6 marketing tools with one AI platform. Blog writer, ad copy, SEO briefs, and more.', cta: 'Try Free', age: '12 days', status: 'Active', spend: '$2,100', impressions: '34K', ctr: '6.3%', angle: 'Price anchor + tool consolidation', offer: 'Free trial' },
]

function reverseEngineer(ad: typeof MOCK_ADS[0]): string {
  return `STRATEGY BREAKDOWN: "${ad.headline}"

CORE ANGLE: ${ad.angle}

WHY IT'S WORKING (${ad.age} old, still running = profitable):
• The headline leads with the customer's pain/desire, not the product
• "${ad.offer}" removes purchase risk — lowers barrier to click
• CTR of ${ad.ctr} is ${parseFloat(ad.ctr) > 4 ? 'above' : 'below'} industry average (2-3%) — this ad is performing well
• Running for ${ad.age} means they're profitable — they wouldn't keep spending otherwise

PSYCHOLOGICAL TRIGGERS USED:
• ${ad.angle.split('+').map(a => a.trim()).join('\n• ')}

HOW TO BUILD A SIMILAR CAMPAIGN:
1. Lead with the same pain point but differentiate your angle
2. Use a similar offer structure (${ad.offer}) but make yours more specific
3. Test 3 headline variants: problem-led, benefit-led, and curiosity-led
4. Match your landing page message to this exact ad angle

COUNTER-STRATEGY:
Instead of competing directly, position against their weakness. If they focus on speed, you focus on quality. If they focus on price, you focus on results.`
}

export default function AdSpyLive() {
  const [domain, setDomain] = useState('')
  const [results, setResults] = useState<typeof MOCK_ADS | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<{ ad: typeof MOCK_ADS[0]; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const spy = async () => {
    if (!domain.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setResults(MOCK_ADS)
    setLoading(false)
  }

  const platformColor: Record<string, string> = {
    'Google Ads': 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]',
    'Meta Ads': 'text-[#00C8FF] bg-[#00C8FF15] border-[#00C8FF30]',
    'LinkedIn Ads': 'text-[#A78BFA] bg-[#6C47FF15] border-[#6C47FF30]',
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Competitor Ad Spy</h1>
        <p className="text-[#9494B0] text-sm">See your competitor's active ads. Reverse-engineer their strategy. Build better campaigns.</p>
      </div>

      {/* Search */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
            <input value={domain} onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && spy()}
              placeholder="Enter competitor domain (e.g. jasper.ai) or brand name"
              className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] placeholder-[#5A5A78] text-sm focus:outline-none focus:border-[#6C47FF] focus:shadow-[0_0_0_3px_#6C47FF20] transition-all" />
          </div>
          <Button size="lg" onClick={spy} disabled={loading || !domain.trim()}>
            {loading ? '⟳ Scanning...' : <><Eye size={16} /> Spy on Ads</>}
          </Button>
        </div>
        {loading && (
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-[#9494B0] mb-2">
              <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>
              Scanning Google Ads, Meta Ads, and LinkedIn Ads libraries...
            </div>
            <div className="h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
              <div className="h-full bg-[#6C47FF] rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#9494B0]">{results.length} active ads found for "{domain}"</span>
            <span className="text-xs text-[#5A5A78]">Older ads = more profitable (they keep running what works)</span>
          </div>

          {results.map(ad => (
            <div key={ad.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 card-glow transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', platformColor[ad.platform] || 'text-[#9494B0] bg-[#1A1A24] border-[#2A2A3A]')}>{ad.platform}</span>
                  <span className="flex items-center gap-1 text-xs text-[#FFB547]">
                    <Clock size={11} /> {ad.age} old
                    {parseInt(ad.age) > 30 && <span className="text-[10px] bg-[#FFB54720] border border-[#FFB54740] px-1.5 py-0.5 rounded-full ml-1">🔥 Profitable</span>}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#5A5A78]">
                  <span>CTR: <strong className="text-[#00D97E]">{ad.ctr}</strong></span>
                  <span>Spend: <strong className="text-[#F0EFFF]">{ad.spend}</strong></span>
                </div>
              </div>

              <div className="bg-[#0D0D14] border border-[#2A2A3A] rounded-xl p-4 mb-3">
                <h3 className="font-semibold text-[#F0EFFF] mb-1">{ad.headline}</h3>
                <p className="text-sm text-[#9494B0] mb-2">{ad.description}</p>
                <span className="text-xs px-3 py-1 rounded-full bg-[#6C47FF] text-white">{ad.cta}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5A5A78]">Angle: <span className="text-[#9494B0]">{ad.angle}</span></span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setAnalysis({ ad, text: reverseEngineer(ad) })}>
                    <Wand2 size={12} /> Reverse Engineer
                  </Button>
                  <Button size="sm">Build Similar</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis modal */}
      {analysis && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAnalysis(null)}>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-hide" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#F0EFFF]">Strategy Analysis</h3>
              <button onClick={() => setAnalysis(null)} className="text-[#5A5A78] hover:text-[#F0EFFF] text-xl">×</button>
            </div>
            <div className="bg-[#0D0D14] border border-[#2A2A3A] rounded-xl p-4 text-xs text-[#9494B0] leading-relaxed whitespace-pre-wrap mb-4 font-mono">
              {analysis.text}
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => { navigator.clipboard.writeText(analysis.text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy analysis</>}
              </Button>
              <Button variant="secondary" className="flex-1">Build counter-campaign</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
