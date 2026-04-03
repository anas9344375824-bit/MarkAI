import { Search, Plus, Menu, X } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { NotificationBell } from '../notifications/NotificationBell'

export function Navbar() {
  const { user, sidebarOpen, setSidebarOpen } = useAppStore()
  const navigate = useNavigate()

  return (
    <header
      className="h-[60px] fixed top-0 right-0 left-0 bg-[#08080C]/90 backdrop-blur-md border-b border-[#2A2A3A] flex items-center px-4 gap-3 z-30 transition-all duration-300"
      style={{ paddingLeft: sidebarOpen ? 'calc(240px + 16px)' : window.innerWidth < 768 ? '16px' : 'calc(64px + 16px)' }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-[#9494B0] hover:text-[#F0EFFF] transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-[#1A1A24]"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
          <input
            placeholder="Search tools, campaigns... (⌘K)"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Button size="sm" onClick={() => navigate('/campaigns/new')} className="hidden sm:flex">
          <Plus size={15} /> New Campaign
        </Button>
        <Button size="sm" onClick={() => navigate('/campaigns/new')} className="sm:hidden px-2">
          <Plus size={15} />
        </Button>
        <NotificationBell />
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full bg-[#2A2A3A] cursor-pointer flex-shrink-0"
          onClick={() => navigate('/settings')}
        />
      </div>
    </header>
  )
}
