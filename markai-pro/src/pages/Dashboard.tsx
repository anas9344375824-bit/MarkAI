import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Copy, Trash2, ExternalLink, ArrowUpRight, AlertTriangle } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { mockDashboardStats, tools } from '../data/mockData'
import { Card } from '../components/ui/Card'
import { Badge, statusBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { formatNumber } from '../lib/utils'

function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return val
}

const TOOL_ROUTES: Record<string, string> = {
  'competitor-spy': '/tools/competitor-spy',
  'analytics-narrator': '/tools/analytics-narrator',
  'brand-voice': '/brand-voice',
  'campaign-builder': '/campaigns/new',
  'client-workspace': '/clients',
  'content-calendar': '/calendar',
  'approval-flow': '/clients',
  'white-label-report': '/clients',
}
const getToolRoute = (id: string) => TOOL_ROUTES[id] ?? `/tools/${id}`

export default function Dashboard() {
  const { user, campaigns, content } = useAppStore()
  const navigate = useNavigate()
  const contentCount = useCountUp(mockDashboardStats.contentCreated)
  const campaignCount = useCountUp(mockDashboardStats.activeCampaigns)
  const wordsCount = useCountUp(mockDashboardStats.wordsGenerated)

  const quickTools = tools.slice(0, 6)
  const creditsRemaining = user.credits.total - user.credits.used
  const creditPct = user.plan === 'agency' ? 100 : Math.max(0, (creditsRemaining / user.credits.total) * 100)
  const lowCredits = user.plan !== 'agency' && creditPct < 20

  const stats = [
    { label: 'Content created', value: contentCount, suffix: '', icon: '✍️', trend: '+12%' },
    { label: 'Active campaigns', value: campaignCount, suffix: '', icon: '🚀', trend: '+2' },
    { label: 'Time saved', value: mockDashboardStats.timeSaved, suffix: ' hrs', icon: '⏱️', trend: '+3.2 hrs' },
    { label: 'Words generated', value: wordsCount, suffix: '', icon: '📝', trend: '+8.4k', format: formatNumber },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Low credits warning */}
      {lowCredits && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FFB54710] border border-[#FFB54730]">
          <AlertTriangle size={16} className="text-[#FFB547] flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm text-[#FFB547] font-medium">Credits running low — </span>
            <span className="text-sm text-[#9494B0]">{creditsRemaining} credits remaining ({Math.round(creditPct)}%)</span>
          </div>
          <Button size="sm" onClick={() => navigate('/settings?tab=billing')}>Upgrade plan</Button>
        </div>
      )}

      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#6C47FF15] to-[#00C8FF10] border border-[#6C47FF30] rounded-xl p-5 md:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-xl md:text-2xl mb-1">{greeting}, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-[#9494B0] text-sm">
              {user.plan === 'agency' ? 'Unlimited credits' : `${creditsRemaining} credits remaining`} ·
              <span className="capitalize ml-1">{user.plan}</span> plan
            </p>
          </div>
          <Button onClick={() => navigate('/campaigns/new')}>
            <ArrowUpRight size={16} /> New Campaign
          </Button>
        </div>
        {user.plan !== 'agency' && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-[#9494B0] mb-1.5">
              <span>Credits used this month</span>
              <span>{user.credits.used} / {user.credits.total}</span>
            </div>
            <div className="h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${lowCredits ? 'bg-[#FFB547]' : 'bg-[#6C47FF]'}`}
                style={{ width: `${100 - creditPct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xl md:text-2xl">{s.icon}</span>
              <span className="text-xs text-[#00D97E] flex items-center gap-1">
                <TrendingUp size={11} /> {s.trend}
              </span>
            </div>
            <div className="font-mono font-bold text-2xl md:text-3xl text-[#F0EFFF] mb-1">
              {s.format ? s.format(s.value) : s.value}{s.suffix}
            </div>
            <div className="text-xs text-[#9494B0]">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#F0EFFF]">Quick Actions</h2>
          <button onClick={() => navigate('/tools')} className="text-sm text-[#6C47FF] hover:text-[#A78BFA] transition-colors">View all tools →</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {quickTools.map((tool, i) => (
            <Card key={tool.id} onClick={() => navigate(getToolRoute(tool.id))}
              className={`group cursor-pointer ${i === 0 ? 'border-[#6C47FF40] bg-[#6C47FF08]' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xl md:text-2xl">{tool.icon}</span>
                {i === 0 && <Badge variant="money">Recommended</Badge>}
              </div>
              <div className="font-medium text-sm text-[#F0EFFF] mb-1">{tool.name}</div>
              <div className="text-xs text-[#5A5A78] mb-3 hidden md:block">{tool.desc}</div>
              <div className="text-xs text-[#6C47FF] opacity-0 group-hover:opacity-100 transition-opacity">Open tool →</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Content */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#F0EFFF]">Recent Content</h2>
            <button className="text-sm text-[#6C47FF] hover:text-[#A78BFA]">View all →</button>
          </div>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-[#2A2A3A]">
                  {['Type', 'Title', 'Platform', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-[#5A5A78] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.slice(0, 6).map(item => (
                  <tr key={item.id} className="border-b border-[#2A2A3A] last:border-0 hover:bg-[#1A1A24] transition-colors">
                    <td className="px-4 py-3">
                      <Badge variant="ai-core" className="text-[10px] whitespace-nowrap">{item.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#F0EFFF] max-w-[180px] truncate">{item.title}</td>
                    <td className="px-4 py-3 text-xs text-[#9494B0] whitespace-nowrap">{item.platform}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadge(item.status)} className="text-[10px] capitalize whitespace-nowrap">{item.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigator.clipboard.writeText(item.title)} className="text-[#5A5A78] hover:text-[#9494B0] transition-colors" title="Copy">
                          <Copy size={14} />
                        </button>
                        <button className="text-[#5A5A78] hover:text-[#FF6B6B] transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Campaigns */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#F0EFFF]">Active Campaigns</h2>
            <button onClick={() => navigate('/campaigns')} className="text-sm text-[#6C47FF] hover:text-[#A78BFA]">View all →</button>
          </div>
          <div className="space-y-3">
            {campaigns.map(c => (
              <Card key={c.id} onClick={() => navigate(`/campaigns/${c.id}`)} className="cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-[#F0EFFF] mb-0.5 truncate">{c.name}</div>
                    <div className="text-xs text-[#9494B0]">{c.client}</div>
                  </div>
                  <ExternalLink size={14} className="text-[#5A5A78] flex-shrink-0 ml-2" />
                </div>
                <div className="flex items-center justify-between text-xs text-[#9494B0] mb-2">
                  <span>{c.contentCount} pieces</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6C47FF] rounded-full transition-all duration-1000" style={{ width: `${c.progress}%` }} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
