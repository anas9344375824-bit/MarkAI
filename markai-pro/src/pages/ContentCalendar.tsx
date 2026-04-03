import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'

const platformColors: Record<string, string> = {
  LinkedIn: 'bg-[#6C47FF30] text-[#A78BFA] border-[#6C47FF40]',
  Instagram: 'bg-[#FF6B9D30] text-[#FF6B9D] border-[#FF6B9D40]',
  Twitter: 'bg-[#00C8FF30] text-[#00C8FF] border-[#00C8FF40]',
  Email: 'bg-[#00D97E30] text-[#00D97E] border-[#00D97E40]',
  Blog: 'bg-[#FFB54730] text-[#FFB547] border-[#FFB54740]',
  Facebook: 'bg-[#4267B230] text-[#7B9FE0] border-[#4267B240]',
}

const sampleEvents: Record<number, { platform: string; title: string }[]> = {
  3: [{ platform: 'LinkedIn', title: 'TechStart Product Launch' }],
  5: [{ platform: 'Instagram', title: 'Bloom Autumn Collection' }, { platform: 'Email', title: 'Welcome Sequence Day 1' }],
  8: [{ platform: 'Blog', title: 'AI Marketing Guide 2025' }],
  10: [{ platform: 'Twitter', title: 'FitLife App Announcement' }, { platform: 'LinkedIn', title: 'Q4 Strategy Post' }],
  12: [{ platform: 'Email', title: 'Black Friday Teaser' }],
  15: [{ platform: 'Instagram', title: 'Behind the Scenes Reel' }, { platform: 'Facebook', title: 'Event Promotion' }],
  18: [{ platform: 'Blog', title: 'SEO Guide: 10 Strategies' }],
  20: [{ platform: 'Email', title: 'Black Friday Main Email' }, { platform: 'Twitter', title: 'BF Sale Thread' }],
  22: [{ platform: 'LinkedIn', title: 'Case Study: TechStart' }],
  25: [{ platform: 'Instagram', title: 'Product Demo Carousel' }],
  28: [{ platform: 'Email', title: 'Last Chance Email' }, { platform: 'Blog', title: 'Year in Review' }],
}

const unscheduled = [
  { platform: 'Instagram', title: 'FitLife January Relaunch Caption' },
  { platform: 'Email', title: 'Drip Sequence Email 3' },
  { platform: 'LinkedIn', title: 'Agency Case Study Post' },
  { platform: 'Blog', title: 'Content Marketing Trends 2025' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function ContentCalendar() {
  const [view, setView] = useState<'month' | 'week' | 'list'>('month')
  const [month, setMonth] = useState(6) // July
  const [year] = useState(2025)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Content Calendar</h1>
          <p className="text-[#9494B0] text-sm">Plan, schedule, and publish your content.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-[#2A2A3A] overflow-hidden">
            {(['month', 'week', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={cn('px-4 py-2 text-sm capitalize transition-colors', view === v ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
                {v}
              </button>
            ))}
          </div>
          <Button size="sm"><Plus size={15} /> Add Content</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Calendar */}
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A3A]">
            <button onClick={() => setMonth(m => m - 1)} className="p-1.5 rounded hover:bg-[#1A1A24] text-[#9494B0] hover:text-[#F0EFFF] transition-all">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-semibold text-[#F0EFFF]">{MONTHS[month]} {year}</h2>
            <button onClick={() => setMonth(m => m + 1)} className="p-1.5 rounded hover:bg-[#1A1A24] text-[#9494B0] hover:text-[#F0EFFF] transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#2A2A3A]">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center text-xs text-[#5A5A78] font-medium">{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => (
              <div key={i}
                onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                className={cn(
                  'min-h-[90px] p-2 border-b border-r border-[#2A2A3A] transition-colors',
                  day ? 'cursor-pointer hover:bg-[#1A1A24]' : 'bg-[#0D0D14]',
                  day === selectedDay && 'bg-[#6C47FF10] border-[#6C47FF30]',
                  (i + 1) % 7 === 0 && 'border-r-0'
                )}>
                {day && (
                  <>
                    <div className={cn('text-xs font-medium mb-1.5 w-6 h-6 flex items-center justify-center rounded-full',
                      day === new Date().getDate() && month === new Date().getMonth() ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0]'
                    )}>{day}</div>
                    <div className="space-y-1">
                      {(sampleEvents[day] || []).map((ev, j) => (
                        <div key={j} className={cn('text-[10px] px-1.5 py-0.5 rounded border truncate', platformColors[ev.platform] || 'bg-[#2A2A3A] text-[#9494B0]')}>
                          {ev.title}
                        </div>
                      ))}
                    </div>
                    {!sampleEvents[day] && (
                      <button className="opacity-0 hover:opacity-100 text-[10px] text-[#5A5A78] flex items-center gap-0.5 transition-opacity">
                        <Plus size={10} /> Add
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected day detail */}
          {selectedDay && sampleEvents[selectedDay] && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">July {selectedDay}</h3>
              <div className="space-y-2">
                {sampleEvents[selectedDay].map((ev, i) => (
                  <div key={i} className={cn('p-3 rounded-lg border text-xs', platformColors[ev.platform] || 'bg-[#1A1A24] border-[#2A2A3A] text-[#9494B0]')}>
                    <div className="font-medium mb-1">{ev.platform}</div>
                    <div className="opacity-80">{ev.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unscheduled queue */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-[#F0EFFF]">Unscheduled Content</h3>
              <span className="text-xs bg-[#FFB54720] text-[#FFB547] border border-[#FFB54740] px-2 py-0.5 rounded-full">{unscheduled.length}</span>
            </div>
            <div className="space-y-2 mb-3">
              {unscheduled.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] cursor-grab active:cursor-grabbing">
                  <div className={cn('text-[10px] font-medium mb-1', platformColors[item.platform]?.split(' ')[1] || 'text-[#9494B0]')}>{item.platform}</div>
                  <div className="text-xs text-[#9494B0] truncate">{item.title}</div>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full">✨ Auto-schedule</Button>
          </div>

          {/* Legend */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">Platforms</h3>
            <div className="space-y-2">
              {Object.entries(platformColors).map(([platform, cls]) => (
                <div key={platform} className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full border', cls)} />
                  <span className="text-xs text-[#9494B0]">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
