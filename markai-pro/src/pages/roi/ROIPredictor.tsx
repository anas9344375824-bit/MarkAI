import { useState } from 'react'
import { DollarSign, TrendingUp, Target, AlertTriangle, BarChart2, Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const PLATFORMS = ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads', 'Email Marketing', 'SEO/Content']
const NICHES = ['SaaS', 'E-commerce', 'Local Business', 'Coaching/Courses', 'Agency', 'Healthcare', 'Real Estate', 'Finance']
const GOALS = ['Brand Awareness', 'Lead Generation', 'Sales/Conversions', 'App Installs', 'Website Traffic']

function predictROI(budget: number, platform: string, niche: string, goal: string) {
  const platformMultipliers: Record<string, { cpc: number; cvr: number; roas: number }> = {
    'Google Ads': { cpc: 2.8, cvr: 0.038, roas: 3.2 },
    'Meta Ads': { cpc: 1.4, cvr: 0.022, roas: 2.8 },
    'LinkedIn Ads': { cpc: 6.5, cvr: 0.055, roas: 2.1 },
    'TikTok Ads': { cpc: 0.9, cvr: 0.018, roas: 2.4 },
    'Email Marketing': { cpc: 0.1, cvr: 0.12, roas: 8.5 },
    'SEO/Content': { cpc: 0.05, cvr: 0.025, roas: 5.2 },
  }
  const nicheMultiplier: Record<string, number> = {
    'SaaS': 1.2, 'E-commerce': 1.0, 'Local Business': 0.9, 'Coaching/Courses': 1.3,
    'Agency': 1.1, 'Healthcare': 0.8, 'Real Estate': 0.95, 'Finance': 1.4,
  }
  const m = platformMultipliers[platform] || platformMultipliers['Google Ads']
  const nm = nicheMultiplier[niche] || 1
  const clicks = Math.round(budget / m.cpc)
  const leads = Math.round(clicks * m.cvr * nm)
  const conversions = Math.round(leads * 0.15)
  const revenue = Math.round(budget * m.roas * nm)
  const riskLevel = m.roas > 4 ? 'Low' : m.roas > 2.5 ? 'Medium' : 'High'
  return { clicks, leads, conversions, revenue, roas: (m.roas * nm).toFixed(1), riskLevel }
}

function buildComparisonData(budget: number, niche: string) {
  return PLATFORMS.map(p => {
    const r = predictROI(budget, p, niche, 'Sales/Conversions')
    return { platform: p.split(' ')[0], revenue: r.revenue, roas: parseFloat(r.roas), leads: r.leads }
  })
}

export default function ROIPredictor() {
  const [budget, setBudget] = useState(1000)
  const [platform, setPlatform] = useState('Google Ads')
  const [niche, setNiche] = useState('SaaS')
  const [goal, setGoal] = useState('Lead Generation')
  const [result, setResult] = useState<ReturnType<typeof predictROI> | null>(null)
  const [compData, setCompData] = useState<ReturnType<typeof buildComparisonData> | null>(null)
  const [loading, setLoading] = useState(false)

  const predict = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setResult(predictROI(budget, platform, niche, goal))
    setCompData(buildComparisonData(budget, niche))
    setLoading(false)
  }

  const riskColor = { Low: 'text-[#00D97E] bg-[#00D97E15] border-[#00D97E30]', Medium: 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]', High: 'text-[#FF6B6B] bg-[#FF6B6B15] border-[#FF6B6B30]' }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">ROI Predictor</h1>
        <p className="text-[#9494B0] text-sm">Predict your marketing ROI before spending a single dollar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        {/* Input */}
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 space-y-4 h-fit">
          <h3 className="font-semibold text-[#F0EFFF]">Campaign Parameters</h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Monthly Budget — <span className="text-[#A78BFA] font-mono">${budget.toLocaleString()}</span></label>
            <input type="range" min={100} max={50000} step={100} value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-[#6C47FF]" />
            <div className="flex justify-between text-[10px] text-[#5A5A78]"><span>$100</span><span>$50,000</span></div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={cn('px-2 py-2 rounded-lg text-xs font-medium border transition-all text-left',
                    platform === p ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9494B0] hover:border-[#3D3D55]')}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Niche</label>
            <select value={niche} onChange={e => setNiche(e.target.value)} className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
              {NICHES.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Campaign Goal</label>
            <select value={goal} onChange={e => setGoal(e.target.value)} className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
              {GOALS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          <Button size="xl" onClick={predict} disabled={loading}>
            {loading ? '⟳ Calculating...' : <><Target size={16} /> Predict ROI</>}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-[#F0EFFF] mb-2">Set your parameters and predict ROI</h3>
              <p className="text-sm text-[#9494B0]">Get predicted clicks, leads, conversions, and revenue before you spend.</p>
            </div>
          )}

          {loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="flex gap-1.5 justify-center mb-4">
                {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
              <p className="text-[#9494B0]">Analysing {niche} market data for {platform}...</p>
            </div>
          )}

          {result && compData && (
            <>
              {/* Main metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Predicted Clicks', value: result.clicks.toLocaleString(), icon: '👆', color: 'text-[#00C8FF]' },
                  { label: 'Predicted Leads', value: result.leads.toLocaleString(), icon: '🎯', color: 'text-[#A78BFA]' },
                  { label: 'Conversions', value: result.conversions.toLocaleString(), icon: '✅', color: 'text-[#00D97E]' },
                  { label: 'Predicted Revenue', value: `$${result.revenue.toLocaleString()}`, icon: '💰', color: 'text-[#FFB547]' },
                ].map(m => (
                  <div key={m.label} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
                    <div className="text-2xl mb-2">{m.icon}</div>
                    <div className={cn('font-mono font-bold text-2xl mb-1', m.color)}>{m.value}</div>
                    <div className="text-xs text-[#5A5A78]">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* ROAS + Risk */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
                  <div className="text-xs text-[#5A5A78] mb-1">Predicted ROAS</div>
                  <div className="font-mono font-bold text-3xl text-[#6C47FF]">{result.roas}×</div>
                  <div className="text-xs text-[#9494B0] mt-1">Return on ad spend</div>
                </div>
                <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
                  <div className="text-xs text-[#5A5A78] mb-1">Risk Level</div>
                  <span className={cn('text-lg font-bold px-3 py-1 rounded-full border', riskColor[result.riskLevel as keyof typeof riskColor])}>{result.riskLevel}</span>
                  <div className="text-xs text-[#9494B0] mt-2">Based on platform + niche data</div>
                </div>
              </div>

              {/* Platform comparison */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <h3 className="font-semibold text-[#F0EFFF] mb-4">Platform Comparison — Best ROI for {niche}</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={compData}>
                    <XAxis dataKey="platform" tick={{ fill: '#5A5A78', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5A5A78', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid #2A2A3A', borderRadius: 8, color: '#F0EFFF' }} />
                    <Bar dataKey="revenue" fill="#6C47FF" radius={[4,4,0,0]} name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Budget split recommendation */}
              <div className="bg-gradient-to-r from-[#6C47FF15] to-[#00C8FF10] border border-[#6C47FF30] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-[#A78BFA]" />
                  <span className="font-semibold text-sm text-[#F0EFFF]">AI Budget Split Recommendation</span>
                </div>
                <p className="text-sm text-[#9494B0]">
                  For <strong className="text-[#F0EFFF]">{niche}</strong> with a <strong className="text-[#F0EFFF]">${budget.toLocaleString()}/mo</strong> budget targeting <strong className="text-[#F0EFFF]">{goal}</strong>:
                  Allocate <strong className="text-[#A78BFA]">40% to {compData.sort((a,b) => b.roas - a.roas)[0].platform}</strong> (highest ROAS),
                  <strong className="text-[#A78BFA]"> 35% to {compData.sort((a,b) => b.roas - a.roas)[1].platform}</strong>,
                  and <strong className="text-[#A78BFA]">25% to Email Marketing</strong> for long-term retention.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
