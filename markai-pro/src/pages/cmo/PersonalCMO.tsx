import { useState, useRef, useEffect } from 'react'
import { Brain, Send, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap, BarChart2, Target } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const ALERTS = [
  { id: '1', type: 'warning', icon: TrendingDown, title: 'SEO dropped 12% this week', body: 'Your blog traffic fell from 4,200 to 3,700 visits. Likely cause: Google core update. Recommended fix: update your top 3 posts with fresh data.', time: '2 hours ago', action: 'Fix now' },
  { id: '2', type: 'opportunity', icon: TrendingUp, title: 'Post this today — it\'s trending', body: '"AI marketing automation" is trending +340% on LinkedIn right now. Your audience is highly relevant. Strike while it\'s hot.', time: '4 hours ago', action: 'Create post' },
  { id: '3', type: 'competitor', icon: AlertTriangle, title: 'Competitor changed their ad', body: 'TechStart Inc updated their Google Ads headline to "AI Tools for Marketers — Free Trial". They\'re targeting your keywords.', time: '6 hours ago', action: 'View analysis' },
  { id: '4', type: 'success', icon: CheckCircle, title: 'Campaign performing above benchmark', body: 'Your "Q4 Black Friday Push" campaign has 6.2% CTR vs 3.1% industry average. Consider increasing budget by 20%.', time: '1 day ago', action: 'Scale up' },
]

const TASKS = [
  { id: '1', priority: 'high', task: 'Update top 3 blog posts with 2025 data', reason: 'SEO drop detected', credits: 15, done: false },
  { id: '2', priority: 'high', task: 'Create LinkedIn post about AI automation trend', reason: 'Trending topic — act within 24h', credits: 3, done: false },
  { id: '3', priority: 'medium', task: 'A/B test new ad headline vs competitor', reason: 'Competitor updated messaging', credits: 5, done: false },
  { id: '4', priority: 'medium', task: 'Increase Black Friday campaign budget', reason: 'Above-benchmark performance', credits: 0, done: true },
  { id: '5', priority: 'low', task: 'Schedule 2 weeks of Instagram content', reason: 'Content calendar gap detected', credits: 20, done: false },
]

const WEEKLY_SUMMARY = {
  contentCreated: 24,
  creditsUsed: 340,
  campaignsActive: 3,
  topPerforming: 'Black Friday Push',
  biggestWin: 'Email open rate hit 31% — 5-year high',
  biggestRisk: 'SEO traffic declining — needs attention',
  score: 74,
}

interface Message { role: 'user' | 'cmo'; content: string; time: string }

const CMO_RESPONSES: Record<string, string> = {
  default: "Based on your current marketing activity, I recommend focusing on three things this week: (1) Fix the SEO drop by refreshing your top content, (2) capitalise on the AI automation trend on LinkedIn, and (3) scale your Black Friday campaign budget by 20%. Want me to create any of this content now?",
  seo: "Your SEO drop is likely caused by the recent Google core update. The pages most affected are your blog posts from 2023 that haven't been updated. I recommend: updating statistics, adding expert quotes, and improving the introduction hooks. I can rewrite all three posts right now — it'll cost 45 credits total.",
  budget: "For your current goals, I recommend this budget split: 40% Google Ads (highest intent), 35% Meta Ads (awareness + retargeting), 15% LinkedIn (B2B leads), 10% content/SEO (long-term). Based on your niche, this should yield approximately 3.2× ROAS.",
  competitor: "Your competitor updated their headline to target your exact keywords. My recommendation: don't match them directly — instead, differentiate. Their weakness is they're not mentioning ROI. Your counter-headline: 'AI Marketing Tools That Pay For Themselves — See ROI in 30 Days'. Want me to build this campaign?",
}

function getCMOResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('seo') || lower.includes('traffic') || lower.includes('rank')) return CMO_RESPONSES.seo
  if (lower.includes('budget') || lower.includes('spend') || lower.includes('money')) return CMO_RESPONSES.budget
  if (lower.includes('competitor') || lower.includes('competition')) return CMO_RESPONSES.competitor
  return CMO_RESPONSES.default
}

export default function PersonalCMO() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'cmo', content: "Good morning! I've analysed your marketing activity from the past 7 days. You have 3 alerts that need attention and 5 priority tasks. Your overall marketing health score is 74/100 — up from 68 last week. What would you like to focus on first?", time: 'Just now' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState(TASKS)
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'tasks'>('overview')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input, time: 'Just now' }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const response = getCMOResponse(input)
    setMessages(prev => [...prev, { role: 'cmo', content: response, time: 'Just now' }])
    setLoading(false)
  }

  const alertColor = { warning: 'border-[#FFB54740] bg-[#FFB54708]', opportunity: 'border-[#00D97E40] bg-[#00D97E08]', competitor: 'border-[#FF6B6B40] bg-[#FF6B6B08]', success: 'border-[#6C47FF40] bg-[#6C47FF08]' }
  const alertIconColor = { warning: 'text-[#FFB547]', opportunity: 'text-[#00D97E]', competitor: 'text-[#FF6B6B]', success: 'text-[#A78BFA]' }
  const priorityColor = { high: 'text-[#FF6B6B] bg-[#FF6B6B15] border-[#FF6B6B30]', medium: 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]', low: 'text-[#9494B0] bg-[#1A1A24] border-[#2A2A3A]' }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#6C47FF] flex items-center justify-center">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl">AI Personal CMO</h1>
          <p className="text-[#9494B0] text-sm">Your always-on Chief Marketing Officer. Monitoring everything, 24/7.</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-2 bg-[#00D97E15] border border-[#00D97E30] rounded-xl">
          <div className="w-2 h-2 rounded-full bg-[#00D97E] animate-pulse" />
          <span className="text-sm text-[#00D97E] font-medium">Active — monitoring</span>
        </div>
      </div>

      {/* Health score */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Marketing Health', value: `${WEEKLY_SUMMARY.score}/100`, icon: '💪', color: 'text-[#00D97E]' },
          { label: 'Content Created', value: WEEKLY_SUMMARY.contentCreated, icon: '✍️', color: 'text-[#A78BFA]' },
          { label: 'Credits Used', value: WEEKLY_SUMMARY.creditsUsed, icon: '⚡', color: 'text-[#FFB547]' },
          { label: 'Active Campaigns', value: WEEKLY_SUMMARY.campaignsActive, icon: '🚀', color: 'text-[#00C8FF]' },
        ].map(s => (
          <div key={s.label} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={cn('font-mono font-bold text-2xl mb-1', s.color)}>{s.value}</div>
            <div className="text-xs text-[#5A5A78]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#111118] border border-[#2A2A3A] rounded-xl p-1 w-fit">
        {[{ id: 'overview', label: '📊 Overview' }, { id: 'chat', label: '💬 Ask CMO' }, { id: 'tasks', label: '✅ Tasks' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all', activeTab === t.id ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-[#F0EFFF]">🔔 Active Alerts</h2>
            {ALERTS.map(alert => {
              const Icon = alert.icon
              return (
                <div key={alert.id} className={cn('border rounded-xl p-4', alertColor[alert.type as keyof typeof alertColor])}>
                  <div className="flex items-start gap-3">
                    <Icon size={18} className={cn('flex-shrink-0 mt-0.5', alertIconColor[alert.type as keyof typeof alertIconColor])} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm text-[#F0EFFF]">{alert.title}</h3>
                        <span className="text-xs text-[#5A5A78]">{alert.time}</span>
                      </div>
                      <p className="text-xs text-[#9494B0] leading-relaxed mb-3">{alert.body}</p>
                      <Button size="sm" variant="secondary">{alert.action}</Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-4">
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">📋 Weekly Summary</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#00D97E10] border border-[#00D97E30]">
                  <div className="text-[10px] text-[#00D97E] uppercase tracking-wide mb-1">Biggest Win</div>
                  <div className="text-xs text-[#F0EFFF]">{WEEKLY_SUMMARY.biggestWin}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FF6B6B10] border border-[#FF6B6B30]">
                  <div className="text-[10px] text-[#FF6B6B] uppercase tracking-wide mb-1">Biggest Risk</div>
                  <div className="text-xs text-[#F0EFFF]">{WEEKLY_SUMMARY.biggestRisk}</div>
                </div>
                <div className="p-3 rounded-lg bg-[#6C47FF10] border border-[#6C47FF30]">
                  <div className="text-[10px] text-[#A78BFA] uppercase tracking-wide mb-1">Top Campaign</div>
                  <div className="text-xs text-[#F0EFFF]">{WEEKLY_SUMMARY.topPerforming}</div>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={() => setActiveTab('chat')}>
              <Brain size={15} /> Ask your CMO anything
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="max-w-3xl">
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm',
                    msg.role === 'cmo' ? 'bg-[#6C47FF]' : 'bg-[#2A2A3A]')}>
                    {msg.role === 'cmo' ? <Brain size={14} className="text-white" /> : '👤'}
                  </div>
                  <div className={cn('max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'cmo' ? 'bg-[#1A1A24] text-[#F0EFFF]' : 'bg-[#6C47FF] text-white')}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6C47FF] flex items-center justify-center flex-shrink-0">
                    <Brain size={14} className="text-white" />
                  </div>
                  <div className="bg-[#1A1A24] rounded-xl px-4 py-3 flex gap-1.5">
                    {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-[#2A2A3A] flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask your CMO anything... e.g. 'Why did my SEO drop?'"
                className="flex-1 h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all" />
              <Button size="md" onClick={sendMessage} disabled={loading || !input.trim()}>
                <Send size={15} />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {['Why did my SEO drop?', 'How should I split my budget?', 'What should I post today?', 'Analyse my competitor'].map(q => (
              <button key={q} onClick={() => { setInput(q); setActiveTab('chat') }}
                className="text-xs px-3 py-1.5 rounded-full bg-[#1A1A24] border border-[#2A2A3A] text-[#9494B0] hover:border-[#6C47FF] hover:text-[#A78BFA] transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#9494B0]">{tasks.filter(t => !t.done).length} tasks remaining</span>
            <span className="text-xs text-[#5A5A78]">{tasks.filter(t => t.done).length}/{tasks.length} completed</span>
          </div>
          {tasks.map(task => (
            <div key={task.id} className={cn('bg-[#111118] border border-[#2A2A3A] rounded-xl p-4 transition-all', task.done && 'opacity-50')}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={task.done}
                  onChange={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                  className="mt-1 accent-[#6C47FF] w-4 h-4 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize', priorityColor[task.priority as keyof typeof priorityColor])}>{task.priority}</span>
                    {task.credits > 0 && <span className="text-[10px] text-[#A78BFA] bg-[#6C47FF15] border border-[#6C47FF30] px-2 py-0.5 rounded-full">{task.credits} credits</span>}
                  </div>
                  <p className={cn('text-sm font-medium', task.done ? 'line-through text-[#5A5A78]' : 'text-[#F0EFFF]')}>{task.task}</p>
                  <p className="text-xs text-[#5A5A78] mt-0.5">Reason: {task.reason}</p>
                </div>
                {!task.done && <Button size="sm" variant="secondary">Do it</Button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
