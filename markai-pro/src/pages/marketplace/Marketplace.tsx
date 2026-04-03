import { useState } from 'react'
import { ShoppingBag, Star, Download, Upload, Search, Filter, DollarSign, Tag } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const CATEGORIES = ['All', 'Templates', 'Prompt Packs', 'Mini Courses', 'Ad Campaigns', 'SEO Packs', 'Tools & Scripts']

const LISTINGS = [
  { id: '1', title: '50 High-Converting Email Templates Pack', category: 'Templates', price: 29, rating: 4.9, reviews: 124, seller: 'Sarah M.', downloads: 840, badge: 'Bestseller', description: '50 proven email templates for welcome sequences, cart abandonment, re-engagement, and more. Includes subject line variants.', icon: '📧' },
  { id: '2', title: 'ChatGPT Marketing Prompt Bible (200 prompts)', category: 'Prompt Packs', price: 19, rating: 4.8, reviews: 89, seller: 'James T.', downloads: 1240, badge: 'Top Rated', description: '200 battle-tested ChatGPT prompts for blog writing, ad copy, social media, email, and SEO. Organised by use case.', icon: '🤖' },
  { id: '3', title: 'Google Ads Starter Campaign Pack', category: 'Ad Campaigns', price: 49, rating: 4.7, reviews: 56, seller: 'Marcus L.', downloads: 320, badge: null, description: 'Complete Google Ads campaign structure for 5 industries. Includes keywords, ad copy, extensions, and bidding strategy.', icon: '🎯' },
  { id: '4', title: 'SEO Content Pack: 30 Blog Post Outlines', category: 'SEO Packs', price: 39, rating: 4.9, reviews: 78, seller: 'Priya K.', downloads: 560, badge: 'New', description: '30 detailed blog post outlines targeting high-volume keywords. Each includes H1, H2s, word count target, and LSI keywords.', icon: '🔍' },
  { id: '5', title: 'Social Media Growth Mini Course', category: 'Mini Courses', price: 79, rating: 4.8, reviews: 43, seller: 'Aisha P.', downloads: 210, badge: null, description: '5-module mini course on growing from 0 to 10K followers on Instagram and LinkedIn. Includes templates and scripts.', icon: '📱' },
  { id: '6', title: 'Meta Ads Scaling Playbook', category: 'Ad Campaigns', price: 59, rating: 4.6, reviews: 34, seller: 'Tom R.', downloads: 180, badge: null, description: 'Step-by-step playbook for scaling Meta Ads from $100/day to $1,000/day. Includes audience research, creative testing, and budget scaling.', icon: '📣' },
]

export default function Marketplace() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof LISTINGS[0] | null>(null)
  const [purchased, setPurchased] = useState<string[]>([])

  const filtered = LISTINGS.filter(l =>
    (category === 'All' || l.category === category) &&
    (l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase()))
  )

  const purchase = (id: string) => {
    setPurchased(prev => [...prev, id])
    setSelected(null)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Marketing Marketplace</h1>
          <p className="text-[#9494B0] text-sm">Buy and sell marketing assets, templates, and courses.</p>
        </div>
        <Button variant="secondary" size="sm">
          <Upload size={14} /> Sell your assets
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{ label: 'Total listings', value: '240+' }, { label: 'Verified sellers', value: '48' }, { label: 'Avg rating', value: '4.8★' }].map(s => (
          <div key={s.label} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4 text-center">
            <div className="font-mono font-bold text-xl text-[#A78BFA] mb-1">{s.value}</div>
            <div className="text-xs text-[#5A5A78]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search marketplace..."
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              category === cat ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0]')}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(listing => (
          <div key={listing.id} onClick={() => setSelected(listing)}
            className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden card-glow cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
            <div className="h-28 bg-gradient-to-br from-[#6C47FF15] to-[#00C8FF08] flex items-center justify-center text-5xl relative">
              {listing.icon}
              {listing.badge && (
                <span className={cn('absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-medium',
                  listing.badge === 'Bestseller' ? 'bg-[#FFB547] text-black' :
                  listing.badge === 'Top Rated' ? 'bg-[#00D97E] text-black' :
                  'bg-[#6C47FF] text-white')}>
                  {listing.badge}
                </span>
              )}
              {purchased.includes(listing.id) && (
                <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-[#00D97E] text-black font-medium">✓ Purchased</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-[#A78BFA] bg-[#6C47FF20] border border-[#6C47FF40] px-2 py-0.5 rounded-full">{listing.category}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Star size={11} className="fill-[#FFB547] text-[#FFB547]" />
                  <span className="text-xs text-[#FFB547]">{listing.rating}</span>
                  <span className="text-xs text-[#5A5A78]">({listing.reviews})</span>
                </div>
              </div>
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-1 leading-snug">{listing.title}</h3>
              <p className="text-xs text-[#5A5A78] mb-3">by {listing.seller} · {listing.downloads} downloads</p>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#00D97E] text-lg">${listing.price}</span>
                <Button size="sm" variant={purchased.includes(listing.id) ? 'ghost' : 'primary'}>
                  {purchased.includes(listing.id) ? <><Download size={12} /> Download</> : 'Buy now'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{selected.icon}</span>
              <button onClick={() => setSelected(null)} className="text-[#5A5A78] hover:text-[#F0EFFF] text-xl">×</button>
            </div>
            <h2 className="font-display font-bold text-xl mb-2">{selected.title}</h2>
            <div className="flex items-center gap-3 mb-3 text-xs text-[#5A5A78]">
              <span>by {selected.seller}</span>
              <div className="flex items-center gap-1"><Star size={11} className="fill-[#FFB547] text-[#FFB547]" />{selected.rating} ({selected.reviews} reviews)</div>
              <span>{selected.downloads} downloads</span>
            </div>
            <p className="text-sm text-[#9494B0] mb-6 leading-relaxed">{selected.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono font-bold text-[#00D97E] text-2xl">${selected.price}</span>
              <span className="text-xs text-[#5A5A78]">One-time purchase · Instant download</span>
            </div>
            <Button size="xl" onClick={() => purchase(selected.id)}>
              <ShoppingBag size={16} /> Buy for ${selected.price}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
