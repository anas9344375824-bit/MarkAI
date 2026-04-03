import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Zap, Clock, BarChart2, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const NICHES = ['All Industries', 'SaaS', 'E-commerce', 'Healthcare', 'Finance', 'Education', 'Real Estate', 'Marketing Agency']

const TRENDS = [
  { id: '1', trend: 'AI-Generated Video Content', category: 'Content Marketing', signal: 'act-now', growth: '+340%', timeframe: '3 months', confidence: 94, description: 'Short-form AI video is exploding. Brands using AI video tools are seeing 3× engagement vs static content.', data: [10,15,22,35,48,67,89,120,156,200,260,340] },
  { id: '2', trend: 'Zero-Click Search Optimisation', category: 'SEO', signal: 'act-now', growth: '+180%', timeframe: '6 months', confidence: 87, description: 'Google AI Overviews are reducing click-through rates. Brands optimising for featured snippets are maintaining visibility.', data: [20,28,35,45,58,72,88,105,125,148,165,180] },
  { id: '3', trend: 'WhatsApp Business Marketing', category: 'Messaging', signal: 'act-now', growth: '+220%', timeframe: '4 months', confidence: 91, description: 'WhatsApp marketing is outperforming email in open rates (98% vs 28%). Especially powerful in India, Brazil, and MENA.', data: [15,22,32,45,62,82,105,130,158,185,210,220] },
  { id: '4', trend: 'Micro-Influencer Campaigns', category: 'Influencer Marketing', signal: 'wait', growth: '+95%', timeframe: '8 months', confidence: 78, description: 'Micro-influencers (10K-100K) are delivering 60% higher engagement than mega-influencers at 10% of the cost.', data: [30,38,45,52,60,68,75,80,85,90,93,95] },
  { id: '5', trend: 'Conversational AI Ads', category: 'Paid Advertising', signal: 'act-now', growth: '+410%', timeframe: '2 months', confidence: 89, description: 'Interactive AI-powered ad experiences are achieving 5× higher conversion rates than static display ads.', data: [5,12,25,45,72,108,155,210,275,330,380,410] },
  { id: '6', trend: 'Privacy-First Marketing', category: 'Data & Analytics', signal: 'wait', growth: '+65%', timeframe: '12 months', confidence: 82, description: 'First-party data strategies are becoming essential as third-party cookies phase out completely in 2025.', data: [10,15,20,26,32,38,44,50,55,59,62,65] },
]

const signalStyle = {
  'act-now': { color: 'text-[#00D97E]', bg: 'bg-[#00D97E15] border-[#00D97E30]', label: '⚡ Act Now', icon: Zap },
  'wait': { color: 'text-[#FFB547]', bg: 'bg-[#FFB54715] border-[#FFB54730]', label: '⏳ Monitor', icon: Clock },
  'declining': { color: 'text-[#FF6B6B]', bg: 'bg-[#FF6B6B15] border-[#FF6B6B30]', label: '📉 Declining', icon: TrendingDown },
}

export default function TrendForecaster() {
  const [niche, setNiche] = useState('All Industries')
  const [filter, setFilter] = useState<'all' | 'act-now' | 'wait'>('all')
  const [selected, setSelected] = useState<typeof TRENDS[0] | null>(null)

  const filtered = TRENDS.filter(t =>
    (filter === 'all' || t.signal === filter)
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Trend Forecaster</h1>
        <p className="text-[#9494B0] text-sm">AI predicts marketing trends 3–6 months ahead. Know what to do before your competitors.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select value={niche} onChange={e => setNiche(e.target.value)} className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
          {NICHES.map(n => <option key={n}>{n}</option>)}
        </select>
        <div className="flex gap-2">
          {[{ id: 'all', label: 'All Trends' }, { id: 'act-now', label: '⚡ Act Now' }, { id: 'wait', label: '⏳ Monitor' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id as typeof filter)}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                filter === f.id ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0]')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          {filtered.map(trend => {
            const sig = signalStyle[trend.signal as keyof typeof signalStyle]
            const chartData = trend.data.map((v, i) => ({ month: `M${i + 1}`, value: v }))
            return (
              <div key={trend.id} onClick={() => setSelected(trend)}
                className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 card-glow cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', sig.bg, sig.color)}>{sig.label}</span>
                      <span className="text-[10px] text-[#5A5A78] bg-[#1A1A24] border border-[#2A2A3A] px-2 py-0.5 rounded-full">{trend.category}</span>
                      <span className="text-[10px] text-[#5A5A78]">Confidence: {trend.confidence}%</span>
                    </div>
                    <h3 className="font-semibold text-[#F0EFFF] mb-1">{trend.trend}</h3>
                    <p className="text-xs text-[#9494B0] leading-relaxed">{trend.description}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="font-mono font-bold text-[#00D97E] text-lg">{trend.growth}</div>
                    <div className="text-xs text-[#5A5A78]">in {trend.timeframe}</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`grad-${trend.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C47FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6C47FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#6C47FF" strokeWidth={2} fill={`url(#grad-${trend.id})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected ? (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 sticky top-6">
              <h3 className="font-semibold text-[#F0EFFF] mb-1">{selected.trend}</h3>
              <p className="text-xs text-[#9494B0] mb-4">{selected.description}</p>
              <div className="space-y-3 mb-4">
                {[
                  { label: 'Growth Rate', value: selected.growth },
                  { label: 'Timeframe', value: selected.timeframe },
                  { label: 'AI Confidence', value: `${selected.confidence}%` },
                  { label: 'Signal', value: signalStyle[selected.signal as keyof typeof signalStyle].label },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A24]">
                    <span className="text-xs text-[#5A5A78]">{m.label}</span>
                    <span className="text-xs font-medium text-[#F0EFFF]">{m.value}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" size="sm">Create content for this trend</Button>
            </div>
          ) : (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🔮</div>
              <p className="text-sm text-[#9494B0]">Click a trend to see detailed forecast and action plan.</p>
            </div>
          )}

          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">📅 Weekly Forecast Report</h3>
            <p className="text-xs text-[#9494B0] mb-3">Get a personalised weekly trend report delivered to your inbox every Monday.</p>
            <Button variant="secondary" size="sm" className="w-full">Subscribe to weekly report</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
