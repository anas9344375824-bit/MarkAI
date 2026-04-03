import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Grid3X3, Rocket, Calendar, Mic, Eye,
  Users, BarChart2, Settings, ChevronRight, Zap,
  Newspaper, Briefcase, GraduationCap, MessageSquare,
  LayoutTemplate, BookOpen, Brain, TrendingUp, Flame,
  Globe, ShoppingBag, Trophy, Sparkles, Dna, Activity
} from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { cn } from '../../lib/utils'

const navSections = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
      { label: 'Tools', icon: Grid3X3, to: '/tools' },
      { label: 'Campaigns', icon: Rocket, to: '/campaigns' },
      { label: 'Calendar', icon: Calendar, to: '/calendar' },
      { label: 'Brand Voice', icon: Mic, to: '/brand-voice' },
      { label: 'Competitors', icon: Eye, to: '/tools/competitor-spy' },
      { label: 'Clients', icon: Users, to: '/clients' },
      { label: 'Reports', icon: BarChart2, to: '/tools/analytics-narrator' },
    ]
  },
  {
    label: 'AI Features',
    items: [
      { label: 'AI CMO', icon: Brain, to: '/cmo' },
      { label: 'ROI Predictor', icon: TrendingUp, to: '/roi-predictor' },
      { label: 'Viral Score', icon: Flame, to: '/viral-score' },
      { label: 'Ad Spy', icon: Eye, to: '/ad-spy' },
      { label: 'Trend Forecaster', icon: Sparkles, to: '/trends' },
      { label: 'Psychology AI', icon: Brain, to: '/psychology' },
      { label: 'Cultural Adapter', icon: Globe, to: '/cultural' },
      { label: 'Influencers', icon: Users, to: '/influencers' },
      { label: 'Brand DNA', icon: Dna, to: '/brand-dna' },
      { label: 'Live Monitor', icon: Activity, to: '/monitor' },
    ]
  },
  {
    label: 'Discover',
    items: [
      { label: 'News Hub', icon: Newspaper, to: '/news' },
      { label: 'Templates', icon: LayoutTemplate, to: '/templates' },
      { label: 'Learn', icon: GraduationCap, to: '/learn' },
      { label: 'Community', icon: MessageSquare, to: '/community' },
      { label: 'Freelancing', icon: Briefcase, to: '/freelancing' },
      { label: 'Jobs', icon: BookOpen, to: '/jobs' },
      { label: 'Marketplace', icon: ShoppingBag, to: '/marketplace' },
      { label: 'Challenges', icon: Trophy, to: '/challenges' },
    ]
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', icon: Settings, to: '/settings' },
    ]
  }
]

export function Sidebar() {
  const { user, sidebarOpen } = useAppStore()
  const navigate = useNavigate()

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-[#111118] border-r border-[#2A2A3A] flex flex-col z-40 transition-all duration-300',
      sidebarOpen ? 'w-60' : 'w-0 md:w-16',
      !sidebarOpen && 'overflow-hidden md:overflow-visible'
    )}>
      {/* Logo */}
      <div className="h-15 flex items-center px-4 border-b border-[#2A2A3A] cursor-pointer flex-shrink-0" onClick={() => navigate('/dashboard')}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#6C47FF] flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-base">
              <span className="text-[#6C47FF]">Mark</span>
              <span className="text-[#F0EFFF]">AI Pro</span>
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
        {navSections.map((section, si) => (
          <div key={section.label}>
            {sidebarOpen && (
              <div className="px-4 py-1.5 mt-2">
                <span className="text-[10px] text-[#3D3D55] uppercase tracking-widest font-medium">{section.label}</span>
              </div>
            )}
            {!sidebarOpen && si > 0 && <div className="mx-3 my-2 h-px bg-[#2A2A3A]" />}
            {section.items.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-all duration-200 text-sm group relative',
                  isActive
                    ? 'bg-[#6C47FF15] text-[#A78BFA] border-l-2 border-[#6C47FF] pl-[14px]'
                    : 'text-[#9494B0] hover:bg-[#1A1A24] hover:text-[#F0EFFF]'
                )}
              >
                <Icon size={16} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate text-xs">{label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1A24] border border-[#2A2A3A] rounded text-xs text-[#F0EFFF] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[#2A2A3A] flex-shrink-0">
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-[#2A2A3A] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#F0EFFF] font-medium truncate">{user.name}</p>
              <span className="text-[10px] bg-[#6C47FF20] text-[#A78BFA] border border-[#6C47FF40] px-1.5 py-0.5 rounded-full">Agency</span>
            </div>
            <ChevronRight size={12} className="text-[#5A5A78] flex-shrink-0" />
          </div>
        ) : (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-[#2A2A3A] mx-auto" />
        )}
      </div>
    </aside>
  )
}
