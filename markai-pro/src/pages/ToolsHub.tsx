import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { tools } from '../data/mockData'
import { Badge, badgeForTool } from '../components/ui/Badge'
import { cn } from '../lib/utils'

const categories = ['All', 'Content', 'Ads', 'SEO', 'Strategy', 'Agency', 'Scheduling']

const categoryColors: Record<string, string> = {
  Content: 'text-[#A78BFA]',
  Ads: 'text-[#FFB547]',
  SEO: 'text-[#00D97E]',
  Strategy: 'text-[#00C8FF]',
  Agency: 'text-[#00C8FF]',
  Scheduling: 'text-[#FF6B6B]',
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

export default function ToolsHub() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = tools.filter(t =>
    (active === 'All' || t.category === active) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Tools</h1>
        <p className="text-[#9494B0]">26 AI-powered tools for every marketing task.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-all',
                active === cat ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0] hover:border-[#3D3D55] hover:text-[#F0EFFF]'
              )}>
              {cat}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="h-10 pl-9 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all w-56"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tool => (
          <div key={tool.id}
            onClick={() => navigate(getToolRoute(tool.id))}
            className="group bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 card-glow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#1A1A24] flex items-center justify-center text-2xl">
                {tool.icon}
              </div>
              <Badge variant={badgeForTool(tool.badge)}>{tool.badge}</Badge>
            </div>
            <h3 className="font-semibold text-[#F0EFFF] mb-1">{tool.name}</h3>
            <p className="text-xs text-[#9494B0] mb-4">{tool.desc}</p>
            <div className="flex items-center justify-between">
              <span className={cn('text-xs font-medium', categoryColors[tool.category] || 'text-[#9494B0]')}>{tool.category}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#5A5A78]">Used {tool.uses}×</span>
                <span className="text-xs text-[#6C47FF] opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#5A5A78]">
          <div className="text-4xl mb-3">🔍</div>
          <p>No tools found for "{search}"</p>
        </div>
      )}
    </div>
  )
}
