import { useState } from 'react'
import { Bell, CheckCheck, Newspaper, Briefcase, GraduationCap, MessageSquare, AlertTriangle, Star } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Notification {
  id: string
  type: 'news' | 'job' | 'course' | 'community' | 'credit' | 'system'
  title: string
  body: string
  time: string
  read: boolean
}

const MOCK: Notification[] = [
  { id: '1', type: 'community', title: 'New reply on your post', body: 'Sarah M. replied to "How I grew organic traffic..."', time: '5 min ago', read: false },
  { id: '2', type: 'news', title: 'Daily AI Digest ready', body: 'Top 5 marketing news stories for today are ready.', time: '1 hour ago', read: false },
  { id: '3', type: 'credit', title: 'Credits running low', body: 'You have 45 credits remaining. Top up to keep creating.', time: '2 hours ago', read: false },
  { id: '4', type: 'job', title: 'New job match', body: '3 new SEO Manager roles match your saved search.', time: '4 hours ago', read: true },
  { id: '5', type: 'course', title: 'New course added', body: 'AI Marketing Tools 2025 is now available in Learning Hub.', time: '1 day ago', read: true },
  { id: '6', type: 'community', title: 'Your post got 50 likes', body: '"Meta Ads ROAS strategy" reached 50 upvotes!', time: '1 day ago', read: true },
  { id: '7', type: 'system', title: 'Credits renewed', body: 'Your monthly 2,000 credits have been renewed.', time: '2 days ago', read: true },
]

const ICON: Record<string, React.ReactNode> = {
  news: <Newspaper size={13} className="text-[#00C8FF]" />,
  job: <Briefcase size={13} className="text-[#FFB547]" />,
  course: <GraduationCap size={13} className="text-[#A78BFA]" />,
  community: <MessageSquare size={13} className="text-[#00D97E]" />,
  credit: <AlertTriangle size={13} className="text-[#FF6B6B]" />,
  system: <Star size={13} className="text-[#6C47FF]" />,
}

const BG: Record<string, string> = {
  news: 'bg-[#00C8FF15]', job: 'bg-[#FFB54715]', course: 'bg-[#6C47FF15]',
  community: 'bg-[#00D97E15]', credit: 'bg-[#FF6B6B15]', system: 'bg-[#6C47FF15]',
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(MOCK)
  const unread = items.filter(n => !n.read).length

  const markAll = () => setItems(p => p.map(n => ({ ...n, read: true })))
  const markOne = (id: string) => setItems(p => p.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-[#9494B0] hover:text-[#F0EFFF] transition-colors p-1">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6C47FF] rounded-full text-[10px] text-white flex items-center justify-center font-medium">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#111118] border border-[#2A2A3A] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A3A]">
              <span className="font-semibold text-sm text-[#F0EFFF]">Notifications</span>
              {unread > 0 && (
                <button onClick={markAll} className="flex items-center gap-1 text-xs text-[#6C47FF] hover:text-[#A78BFA] transition-colors">
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-hide">
              {items.map(n => (
                <div key={n.id} onClick={() => markOne(n.id)}
                  className={cn('flex items-start gap-3 px-4 py-3 border-b border-[#2A2A3A] last:border-0 cursor-pointer hover:bg-[#1A1A24] transition-colors',
                    !n.read && 'bg-[#6C47FF08]')}>
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', BG[n.type])}>
                    {ICON[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-xs font-medium leading-snug', n.read ? 'text-[#9494B0]' : 'text-[#F0EFFF]')}>{n.title}</p>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#6C47FF] flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-[11px] text-[#5A5A78] mt-0.5 leading-snug">{n.body}</p>
                    <p className="text-[10px] text-[#3D3D55] mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-[#2A2A3A] text-center">
              <button className="text-xs text-[#6C47FF] hover:text-[#A78BFA] transition-colors">View all notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
