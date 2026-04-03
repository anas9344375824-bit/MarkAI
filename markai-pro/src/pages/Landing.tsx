import { useNavigate } from 'react-router-dom'
import { Play, ArrowRight, Check, X, Star, Zap, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { tools } from '../data/mockData'
import { useState } from 'react'

const features = [
  { icon: '🚀', name: 'Campaign Builder', desc: 'One brief → full multi-channel campaign in minutes' },
  { icon: '🎙️', name: 'Brand Voice AI', desc: 'AI that writes exactly like your brand, every time' },
  { icon: '🕵️', name: 'Competitor Spy', desc: 'Uncover gaps and counter-strategies instantly' },
  { icon: '📊', name: 'Analytics Narrator', desc: 'Turn raw data into beautiful client reports' },
  { icon: '✅', name: 'Client Approval Flow', desc: 'Review, approve, and publish without email chains' },
  { icon: '📅', name: 'Content Calendar', desc: '30-day content plan from a single brief' },
]

const testimonials = [
  { quote: "MarkAI Pro replaced 6 tools I was paying for. My agency saves 20+ hours a week.", name: 'Sarah M.', role: 'Agency Owner', company: 'Spark Digital' },
  { quote: "The Campaign Builder is insane. I brief it once and get 40+ pieces of content ready to go.", name: 'James T.', role: 'Freelance Marketer', company: 'Self-employed' },
  { quote: "Brand Voice AI actually sounds like us. Our clients can't tell the difference.", name: 'Priya K.', role: 'Head of Content', company: 'GrowthLab' },
]

const comparison = [
  { feature: 'Price/month', markai: '$49', jasper: '$99', copyai: '$49', chatgpt: '$20' },
  { feature: 'Tools count', markai: '26', jasper: '8', copyai: '10', chatgpt: '1' },
  { feature: 'Brand voice memory', markai: true, jasper: true, copyai: false, chatgpt: false },
  { feature: 'Campaign workflow', markai: true, jasper: false, copyai: false, chatgpt: false },
  { feature: 'Client workspace', markai: true, jasper: false, copyai: false, chatgpt: false },
  { feature: 'Direct publishing', markai: true, jasper: false, copyai: false, chatgpt: false },
  { feature: 'Competitor analysis', markai: true, jasper: false, copyai: false, chatgpt: false },
]

const categories = ['All', 'Content', 'SEO', 'Ads', 'Social', 'Strategy', 'Agency', 'Scheduling']

const logos = ['Shopify', 'HubSpot', 'Meta', 'Google Ads', 'Mailchimp', 'WordPress', 'Canva', 'Buffer']

export default function Landing() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [annual, setAnnual] = useState(false)

  const filteredTools = activeCategory === 'All' ? tools : tools.filter(t => t.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#08080C] text-[#F0EFFF]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-[#08080C]/80 backdrop-blur-md border-b border-[#2A2A3A]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6C47FF] flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg">
            <span className="text-[#6C47FF]">Mark</span><span>AI Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
          <Button size="sm" onClick={() => navigate('/signup')}>Start free</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">
        {/* Animated gradient bg */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6C47FF] rounded-full blur-[120px] opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00C8FF] rounded-full blur-[100px] opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4A2FD4] rounded-full blur-[80px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C47FF20] border border-[#6C47FF40] text-[#A78BFA] text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D97E] animate-pulse" />
            26 AI tools · One platform · Zero switching
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight mb-6">
            The only AI tool a<br />
            <span className="gradient-text">digital marketer</span><br />
            will ever need
          </h1>

          <p className="text-xl text-[#9494B0] mb-10 max-w-2xl mx-auto">
            26 tools. One platform. Built to make every other tool obsolete.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start free — no credit card <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" size="lg">
              <Play size={18} /> Watch 2-min demo
            </Button>
          </div>

          {/* Trust bar */}
          <div className="flex items-center justify-center gap-4 text-sm text-[#9494B0]">
            <div className="flex -space-x-2">
              {[1,2,3,4,5,6,7,8].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-8 h-8 rounded-full border-2 border-[#08080C] bg-[#1A1A24]" />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#FFB547] text-[#FFB547]" />)}
            </div>
            <span>Trusted by <strong className="text-[#F0EFFF]">2,400+</strong> marketers</span>
          </div>
        </div>

        {/* Hero mockup */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto">
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl overflow-hidden shadow-[0_0_80px_#6C47FF20]"
            style={{ transform: 'perspective(1000px) rotateX(5deg)' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2A2A3A] bg-[#0D0D14]">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
              <div className="w-3 h-3 rounded-full bg-[#FFB547]" />
              <div className="w-3 h-3 rounded-full bg-[#00D97E]" />
              <span className="ml-2 text-xs text-[#5A5A78]">MarkAI Pro — Dashboard</span>
            </div>
            <div className="grid grid-cols-4 gap-0 h-64">
              <div className="col-span-1 border-r border-[#2A2A3A] p-3 space-y-2">
                {['Dashboard', 'Tools', 'Campaigns', 'Calendar', 'Brand Voice'].map(item => (
                  <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${item === 'Dashboard' ? 'bg-[#6C47FF15] text-[#A78BFA]' : 'text-[#5A5A78]'}`}>
                    <div className="w-3 h-3 rounded bg-current opacity-50" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="col-span-3 p-4">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[{ label: 'Content Created', val: '127' }, { label: 'Active Campaigns', val: '4' }, { label: 'Hours Saved', val: '18.4' }, { label: 'Words Generated', val: '64.2k' }].map(s => (
                    <div key={s.label} className="bg-[#1A1A24] rounded-lg p-2">
                      <div className="text-lg font-bold text-[#6C47FF] font-mono">{s.val}</div>
                      <div className="text-[10px] text-[#5A5A78]">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Blog Writer', 'Ad Copy', 'Campaign Builder', 'SEO Brief', 'Caption Gen', 'Analytics'].map(t => (
                    <div key={t} className="bg-[#1A1A24] rounded p-2 text-xs text-[#9494B0]">{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo ticker */}
      <section className="py-12 border-y border-[#2A2A3A] overflow-hidden">
        <div className="flex gap-16 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {[...logos, ...logos].map((logo, i) => (
            <span key={i} className="text-[#3D3D55] font-semibold text-lg">{logo}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl mb-4">Everything. Connected.</h2>
          <p className="text-[#9494B0] text-lg">Every tool talks to every other tool. Your brand voice, your data, your workflow.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.name} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 card-glow transition-all duration-200 hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-[#6C47FF20] flex items-center justify-center text-2xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-[#F0EFFF] mb-2">{f.name}</h3>
              <p className="text-sm text-[#9494B0]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools preview */}
      <section className="py-24 px-6 bg-[#111118] border-y border-[#2A2A3A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl mb-4">26 tools in one place</h2>
            <p className="text-[#9494B0]">Every tool you need, built for marketers, powered by AI.</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-[#6C47FF] text-white' : 'bg-[#1A1A24] text-[#9494B0] hover:text-[#F0EFFF] border border-[#2A2A3A]'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.slice(0, 12).map(tool => (
              <div key={tool.id} className="bg-[#08080C] border border-[#2A2A3A] rounded-xl p-4 card-glow transition-all duration-200">
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="font-medium text-sm text-[#F0EFFF] mb-1">{tool.name}</div>
                <div className="text-xs text-[#5A5A78]">{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl mb-4">Why switch from the rest</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A3A]">
                <th className="text-left py-4 px-4 text-[#9494B0] font-normal">Feature</th>
                <th className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="font-display font-bold text-[#6C47FF]">MarkAI Pro</span>
                    <span className="text-xs bg-[#6C47FF20] text-[#A78BFA] border border-[#6C47FF40] px-2 py-0.5 rounded-full">Best value</span>
                  </div>
                </th>
                {['Jasper', 'Copy.ai', 'ChatGPT Plus'].map(c => (
                  <th key={c} className="py-4 px-4 text-center text-[#5A5A78] font-normal">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={i} className="border-b border-[#2A2A3A] hover:bg-[#111118] transition-colors">
                  <td className="py-3 px-4 text-sm text-[#9494B0]">{row.feature}</td>
                  {[row.markai, row.jasper, row.copyai, row.chatgpt].map((val, j) => (
                    <td key={j} className={`py-3 px-4 text-center ${j === 0 ? 'text-[#F0EFFF] font-medium' : 'text-[#5A5A78]'}`}>
                      {typeof val === 'boolean'
                        ? val ? <Check size={18} className={`mx-auto ${j === 0 ? 'text-[#00D97E]' : 'text-[#5A5A78]'}`} />
                               : <X size={18} className="mx-auto text-[#FF6B6B]" />
                        : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-[#111118] border-y border-[#2A2A3A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl mb-4">Simple, transparent pricing</h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-sm ${!annual ? 'text-[#F0EFFF]' : 'text-[#9494B0]'}`}>Monthly</span>
              <button onClick={() => setAnnual(!annual)}
                className={`w-12 h-6 rounded-full transition-colors ${annual ? 'bg-[#6C47FF]' : 'bg-[#2A2A3A]'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm ${annual ? 'text-[#F0EFFF]' : 'text-[#9494B0]'}`}>
                Annual <span className="text-xs bg-[#00D97E20] text-[#00D97E] border border-[#00D97E40] px-1.5 py-0.5 rounded-full ml-1">Save 20%</span>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: annual ? 15 : 19, features: ['5 tools', '50 credits/mo', 'Brand voice', 'Email support'], popular: false },
              { name: 'Pro', price: annual ? 39 : 49, features: ['All 26 tools', '500 credits/mo', 'Brand voice AI', 'Campaign builder', 'Priority support'], popular: true },
              { name: 'Agency', price: annual ? 79 : 99, features: ['Everything in Pro', 'Unlimited credits', '10 client workspaces', 'White-label reports', 'Team members', 'Dedicated support'], popular: false },
            ].map(plan => (
              <div key={plan.name} className={`relative bg-[#08080C] border rounded-xl p-6 transition-all duration-200 ${plan.popular ? 'border-[#6C47FF] shadow-[0_0_40px_#6C47FF20]' : 'border-[#2A2A3A] card-glow'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#6C47FF] rounded-full text-xs font-medium text-white">Most popular</div>
                )}
                <h3 className="font-display font-bold text-xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-[#9494B0]">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#9494B0]">
                      <Check size={15} className="text-[#00D97E] flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? 'primary' : 'secondary'} size="lg" className="w-full" onClick={() => navigate('/signup')}>
                  Get started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl mb-4">Loved by marketers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 card-glow">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#FFB547] text-[#FFB547]" />)}
              </div>
              <p className="text-[#9494B0] text-sm mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} className="w-10 h-10 rounded-full bg-[#2A2A3A]" />
                <div>
                  <div className="font-medium text-sm text-[#F0EFFF]">{t.name}</div>
                  <div className="text-xs text-[#5A5A78]">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center border-t border-[#2A2A3A]">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-4xl mb-4">Ready to replace your entire marketing stack?</h2>
          <p className="text-[#9494B0] mb-8">Join 2,400+ marketers who switched to MarkAI Pro.</p>
          <Button size="xl" onClick={() => navigate('/signup')} className="max-w-xs mx-auto">
            Start free — no credit card <ChevronRight size={18} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A3A] py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#6C47FF] flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-display font-bold"><span className="text-[#6C47FF]">Mark</span>AI Pro</span>
            </div>
            <p className="text-xs text-[#5A5A78]">Every marketing tool you need. One platform. Zero switching.</p>
          </div>
          {[
            { title: 'Product', links: ['Tools', 'Campaigns', 'Pricing', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-[#F0EFFF] mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><a href="#" className="text-xs text-[#5A5A78] hover:text-[#9494B0] transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2A2A3A] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#5A5A78]">© 2025 MarkAI Pro. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-[#5A5A78]">
            <a href="#" className="hover:text-[#9494B0]">Privacy Policy</a>
            <a href="#" className="hover:text-[#9494B0]">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
