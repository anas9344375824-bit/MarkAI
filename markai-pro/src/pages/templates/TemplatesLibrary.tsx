import { useState } from 'react'
import { Search, Copy, Check, Star, Wand2, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['All', 'Email', 'Social Media', 'Ad Copy', 'SEO', 'Reports', 'Proposals', 'Marketing Plans', 'Funnels']

const TEMPLATES = [
  { id: '1', category: 'Email', title: 'SaaS Welcome Email Sequence (5 emails)', uses: 1240, preview: 'Subject: Welcome to [Product] — here\'s how to get started\n\nHi [Name],\n\nWelcome aboard! You\'ve just made a great decision...', tags: ['welcome', 'onboarding', 'SaaS'], featured: true },
  { id: '2', category: 'Ad Copy', title: 'High-Converting Facebook Ad (E-commerce)', uses: 980, preview: '🔥 FLASH SALE — 48 Hours Only\n\nTired of [pain point]? [Product] changes everything.\n\n✅ [Benefit 1]\n✅ [Benefit 2]\n✅ [Benefit 3]', tags: ['facebook', 'ecommerce', 'sales'], featured: true },
  { id: '3', category: 'SEO', title: 'SEO Content Brief Template', uses: 756, preview: 'TARGET KEYWORD: [keyword]\nSEARCH INTENT: Informational\nWORD COUNT: 1,500–2,000\n\nH1: [Main keyword question]\n\nOUTLINE:\n1. Introduction...', tags: ['SEO', 'content brief', 'blog'], featured: false },
  { id: '4', category: 'Social Media', title: 'LinkedIn Thought Leadership Post', uses: 634, preview: 'I made a mistake that cost me $50,000.\n\nHere\'s what I learned:\n\n[Hook statement]\n\n1. [Lesson 1]\n2. [Lesson 2]\n3. [Lesson 3]', tags: ['LinkedIn', 'thought leadership', 'B2B'], featured: false },
  { id: '5', category: 'Proposals', title: 'Freelance Marketing Proposal Template', uses: 521, preview: 'MARKETING PROPOSAL\nPrepared for: [Client Name]\nDate: [Date]\n\nEXECUTIVE SUMMARY\n[2-3 sentences about the opportunity]...', tags: ['proposal', 'freelance', 'client'], featured: true },
  { id: '6', category: 'Reports', title: 'Monthly Marketing Performance Report', uses: 489, preview: 'MONTHLY MARKETING REPORT\n[Month] [Year]\n\nEXECUTIVE SUMMARY\nThis month we achieved [X] across all channels...\n\nKEY METRICS\n• Traffic: [X] (+X%)', tags: ['report', 'monthly', 'KPIs'], featured: false },
  { id: '7', category: 'Email', title: 'Cart Abandonment Email (3-part sequence)', uses: 412, preview: 'Subject: You left something behind 👀\n\nHi [Name],\n\nWe noticed you were checking out [Product] but didn\'t complete your purchase...', tags: ['cart abandonment', 'ecommerce', 'recovery'], featured: false },
  { id: '8', category: 'Funnels', title: 'Lead Generation Funnel Map', uses: 387, preview: 'AWARENESS\n→ Blog post targeting [keyword]\n→ Social media content\n→ Paid ads\n\nINTEREST\n→ Lead magnet: [Free resource]\n→ Landing page...', tags: ['funnel', 'lead gen', 'strategy'], featured: false },
  { id: '9', category: 'Marketing Plans', title: '90-Day Marketing Plan Template', uses: 356, preview: 'Q[X] MARKETING PLAN\n\nOBJECTIVES\n1. [Primary goal with metric]\n2. [Secondary goal]\n\nMONTH 1 — FOUNDATION\nWeek 1-2: [Actions]...', tags: ['planning', 'strategy', 'quarterly'], featured: true },
  { id: '10', category: 'Social Media', title: 'Instagram Content Calendar (30 days)', uses: 298, preview: 'WEEK 1\nMonday: Educational post — [Topic]\nTuesday: Behind the scenes\nWednesday: User testimonial\nThursday: Product feature...', tags: ['Instagram', 'content calendar', 'social'], featured: false },
]

export default function TemplatesLibrary() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [saved, setSaved] = useState<string[]>([])
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null)
  const navigate = useNavigate()

  const filtered = TEMPLATES.filter(t =>
    (category === 'All' || t.category === category) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  )

  const copyTemplate = (id: string, preview: string) => {
    navigator.clipboard.writeText(preview)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleSave = (id: string) =>
    setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Templates Library</h1>
          <p className="text-[#9494B0] text-sm">Ready-made marketing templates. One click to use.</p>
        </div>
        <Button variant="secondary" size="sm">
          <Plus size={14} /> Submit template
        </Button>
      </div>

      {/* Featured */}
      <div className="mb-8">
        <h2 className="font-semibold text-[#F0EFFF] mb-4 flex items-center gap-2">
          <Star size={16} className="text-[#FFB547] fill-[#FFB547]" /> Featured Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.filter(t => t.featured).map(t => (
            <div key={t.id} onClick={() => setSelected(t)}
              className="bg-gradient-to-br from-[#6C47FF15] to-[#00C8FF08] border border-[#6C47FF30] rounded-xl p-4 cursor-pointer card-glow transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-[#A78BFA] bg-[#6C47FF20] border border-[#6C47FF40] px-2 py-0.5 rounded-full">{t.category}</span>
                <Star size={11} className="text-[#FFB547] fill-[#FFB547] ml-auto" />
              </div>
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-2 leading-snug">{t.title}</h3>
              <div className="text-xs text-[#5A5A78]">Used {t.uses.toLocaleString()} times</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              category === cat ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0]'
            )}>{cat}</button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden card-glow transition-all duration-200 hover:-translate-y-0.5">
            {/* Preview */}
            <div onClick={() => setSelected(t)} className="p-4 cursor-pointer">
              <div className="bg-[#0D0D14] rounded-lg p-3 mb-3 h-24 overflow-hidden relative">
                <pre className="text-[10px] text-[#5A5A78] font-mono leading-relaxed whitespace-pre-wrap">{t.preview}</pre>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0D0D14] to-transparent" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-[#A78BFA] bg-[#6C47FF20] border border-[#6C47FF40] px-2 py-0.5 rounded-full">{t.category}</span>
                <span className="text-xs text-[#5A5A78] ml-auto">Used {t.uses.toLocaleString()}×</span>
              </div>
              <h3 className="font-semibold text-sm text-[#F0EFFF] leading-snug">{t.title}</h3>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex items-center gap-2">
              <div className="flex gap-1 flex-wrap flex-1">
                {t.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A24] border border-[#2A2A3A] text-[#5A5A78]">{tag}</span>
                ))}
              </div>
              <button onClick={() => toggleSave(t.id)} className={cn('p-1.5 rounded transition-colors', saved.includes(t.id) ? 'text-[#FFB547]' : 'text-[#5A5A78] hover:text-[#9494B0]')}>
                <Star size={14} className={saved.includes(t.id) ? 'fill-[#FFB547]' : ''} />
              </button>
              <button onClick={() => copyTemplate(t.id, t.preview)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#6C47FF] text-white text-xs font-medium hover:bg-[#4A2FD4] transition-colors">
                {copied === t.id ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Use template</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-hide" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-[#A78BFA] bg-[#6C47FF20] border border-[#6C47FF40] px-2 py-0.5 rounded-full">{selected.category}</span>
                <h2 className="font-display font-bold text-xl mt-2">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#5A5A78] hover:text-[#F0EFFF] text-xl">×</button>
            </div>
            <pre className="bg-[#0D0D14] border border-[#2A2A3A] rounded-xl p-4 text-sm text-[#9494B0] font-mono leading-relaxed whitespace-pre-wrap mb-4">{selected.preview}</pre>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => { copyTemplate(selected.id, selected.preview); setSelected(null) }}>
                <Copy size={15} /> Copy template
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => { navigate('/tools/blog-writer'); setSelected(null) }}>
                <Wand2 size={15} /> Use in tool
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
