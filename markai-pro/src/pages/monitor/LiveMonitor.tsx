import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Zap, DollarSign, Eye, MousePointer } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const generateMetric = (base: number, variance: number) => Math.round(base + (Math.random() - 0.5) * variance)

const CAMPAIGNS = [
  { id: '1', name: 'Q4 Black Friday Push', platform: 'Google Ads', status: 'active', budget: 5000, spent: 3240, impressions: 124000, clicks: 5208, conversions: 198, ctr: 4.2, cpa: 16.4, roas: 3.8 },
  { id: '2', name: 'Bloom Autumn Collection', platform: 'Meta Ads', status: 'active', budget: 2000, spent: 890, impressions: 67000, clicks: 2546, conversions: 56, ctr: 3.8, cpa: 15.9, roas: 2.9 },
  { id: '3', name: 'FitLife January Relaunch', platform: 'Google Ads', status: 'warning', budget: 8000, spent: 6100, impressions: 210000, clicks: 7350, conversions: 89, ctr: 3.5, cpa: 68.5, roas: 1.2 },
]

const ALERTS = [
  { id: '1', type: 'warning', campaign: 'FitLife January Relaunch', message: 'CPA increased 45% in the last 2 hours. Consider pausing or adjusting bids.', time: '12 min ago' },
  { id: '2', type: 'info', campaign: 'Q4 Black Friday Push', message: 'CTR above benchmark (4.2% vs 2.8% avg). Consider increasing budget.', time: '1 hour ago' },
]

export default function LiveMonitor() {
  const [metrics, setMetrics] = useState(CAMPAIGNS)
  const [chartData, setChartData] = useState(
    Array.from({ length: 12 }, (_, i) => ({ time: `${i * 2}:00`, impressions: generateMetric(10000, 3000), clicks: generateMetric(400, 100), conversions: generateMetric(15, 8) }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => [...prev.slice(1), { time: 'Now', impressions: generateMetric(10000, 3000), clicks: generateMetric(400, 100), conversions: generateMetric(15, 8) }])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const statusColor = { active: 'text-[#00D97E] bg-[#00D97E15] border-[#00D97E30]', warning: 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]', paused: 'text-[#5A5A78] bg-[#1A1A24] border-[#2A2A3A]' }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Live Campaign Monitor</h1>
          <p className="text-[#9494B0] text-sm">Real-time metrics across all active campaigns.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#00D97E15] border border-[#00D97E30] rounded-xl">
          <div className="w-2 h-2 rounded-full bg-[#00D97E] animate-pulse" />
          <span className="text-sm text-[#00D97E] font-medium">Live — updating every 30s</span>
        </div>
      </div>

      {/* Alerts */}
      {ALERTS.length > 0 && (
        <div className="space-y-2 mb-6">
          {ALERTS.map(alert => (
            <div key={alert.id} className={cn('flex items-start gap-3 p-3 rounded-xl border', alert.type === 'warning' ? 'bg-[#FFB54710] border-[#FFB54730]' : 'bg-[#6C47FF10] border-[#6C47FF30]')}>
              <AlertTriangle size={15} className={alert.type === 'warning' ? 'text-[#FFB547]' : 'text-[#A78BFA]'} />
              <div className="flex-1">
                <span className="text-xs font-medium text-[#F0EFFF]">{alert.campaign}: </span>
                <span className="text-xs text-[#9494B0]">{alert.message}</span>
              </div>
              <span className="text-[10px] text-[#5A5A78] flex-shrink-0">{alert.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Live chart */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-[#F0EFFF] mb-4">Real-Time Performance (last 24h)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" tick={{ fill: '#5A5A78', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#5A5A78', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid #2A2A3A', borderRadius: 8, color: '#F0EFFF', fontSize: 11 }} />
            <Line type="monotone" dataKey="impressions" stroke="#6C47FF" strokeWidth={2} dot={false} name="Impressions" />
            <Line type="monotone" dataKey="clicks" stroke="#00C8FF" strokeWidth={2} dot={false} name="Clicks" />
            <Line type="monotone" dataKey="conversions" stroke="#00D97E" strokeWidth={2} dot={false} name="Conversions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign cards */}
      <div className="space-y-4">
        {metrics.map(c => (
          <div key={c.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-[#F0EFFF]">{c.name}</h3>
                <span className="text-xs text-[#5A5A78]">{c.platform}</span>
                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize', statusColor[c.status as keyof typeof statusColor])}>{c.status}</span>
              </div>
              <div className="flex gap-2">
                {c.status === 'warning' && <Button variant="danger" size="sm">Pause Campaign</Button>}
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: 'Budget Used', value: `$${c.spent.toLocaleString()}/$${c.budget.toLocaleString()}`, icon: DollarSign, color: 'text-[#FFB547]' },
                { label: 'Impressions', value: c.impressions.toLocaleString(), icon: Eye, color: 'text-[#9494B0]' },
                { label: 'Clicks', value: c.clicks.toLocaleString(), icon: MousePointer, color: 'text-[#00C8FF]' },
                { label: 'CTR', value: `${c.ctr}%`, icon: TrendingUp, color: c.ctr > 3 ? 'text-[#00D97E]' : 'text-[#FFB547]' },
                { label: 'Conversions', value: c.conversions, icon: Zap, color: 'text-[#A78BFA]' },
                { label: 'ROAS', value: `${c.roas}×`, icon: TrendingUp, color: c.roas > 2 ? 'text-[#00D97E]' : 'text-[#FF6B6B]' },
              ].map(m => (
                <div key={m.label} className="bg-[#1A1A24] rounded-lg p-3">
                  <div className={cn('font-mono font-bold text-sm mb-0.5', m.color)}>{m.value}</div>
                  <div className="text-[10px] text-[#5A5A78]">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[#5A5A78] mb-1">
                <span>Budget burn rate</span>
                <span>{Math.round((c.spent / c.budget) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full transition-all', (c.spent / c.budget) > 0.8 ? 'bg-[#FF6B6B]' : 'bg-[#6C47FF]')}
                  style={{ width: `${(c.spent / c.budget) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
