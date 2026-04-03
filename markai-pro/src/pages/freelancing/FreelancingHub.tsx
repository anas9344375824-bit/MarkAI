import { useState } from 'react'
import { Search, Filter, ExternalLink, Wand2, Copy, Check, Calculator, FileText } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'

const JOBS = [
  { id: '1', title: 'SEO Content Writer', budget: '$500–$1,500', type: 'Fixed', platform: 'Upwork', skills: ['SEO', 'Content Writing', 'WordPress'], posted: '2 hours ago', description: 'Looking for an experienced SEO content writer to create 10 blog posts per month targeting specific keywords for our SaaS product.' },
  { id: '2', title: 'Facebook Ads Manager', budget: '$25–$45/hr', type: 'Hourly', platform: 'PeoplePerHour', skills: ['Meta Ads', 'Facebook', 'ROAS'], posted: '4 hours ago', description: 'Need a skilled Facebook Ads manager to run and optimise campaigns for our e-commerce store. Budget $3,000/month ad spend.' },
  { id: '3', title: 'Email Marketing Specialist', budget: '$800–$2,000', type: 'Fixed', platform: 'Fiverr', skills: ['Mailchimp', 'Email Copywriting', 'Automation'], posted: '6 hours ago', description: 'Set up a complete email marketing funnel including welcome sequence, nurture series, and promotional campaigns.' },
  { id: '4', title: 'Google Ads PPC Expert', budget: '$30–$60/hr', type: 'Hourly', platform: 'Toptal', skills: ['Google Ads', 'PPC', 'Analytics'], posted: '8 hours ago', description: 'Senior PPC expert needed to manage $50k/month Google Ads budget for B2B SaaS company.' },
  { id: '5', title: 'Social Media Manager', budget: '$1,200–$2,500', type: 'Fixed', platform: 'Upwork', skills: ['Instagram', 'LinkedIn', 'Content Calendar'], posted: '1 day ago', description: 'Manage social media presence across Instagram, LinkedIn, and Twitter for a growing fintech startup.' },
  { id: '6', title: 'Marketing Funnel Strategist', budget: '$2,000–$5,000', type: 'Fixed', platform: 'PeoplePerHour', skills: ['Funnels', 'Copywriting', 'CRO'], posted: '1 day ago', description: 'Build a complete marketing funnel from awareness to conversion for our online course business.' },
]

const PLATFORMS = ['All', 'Upwork', 'Fiverr', 'PeoplePerHour', 'Toptal']
const TYPES = ['All', 'Fixed', 'Hourly']

const platformColor: Record<string, string> = {
  Upwork: 'text-[#00D97E] bg-[#00D97E15] border-[#00D97E30]',
  Fiverr: 'text-[#00C8FF] bg-[#00C8FF15] border-[#00C8FF30]',
  PeoplePerHour: 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]',
  Toptal: 'text-[#A78BFA] bg-[#6C47FF15] border-[#6C47FF30]',
}

function ProposalWriter() {
  const [jobDesc, setJobDesc] = useState('')
  const [tone, setTone] = useState('Professional')
  const [proposal, setProposal] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!jobDesc.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const t = tone === 'Bold' ? 'I\'ll be direct' : tone === 'Friendly' ? 'I\'d love to help' : 'I am writing to express my interest'
    setProposal(`${t} in this opportunity.

After carefully reviewing your project requirements, I'm confident I can deliver exactly what you're looking for — and more.

**Why I'm the right fit:**
- ${jobDesc.split(' ').slice(0, 5).join(' ')} is an area where I have 3+ years of hands-on experience
- I've successfully completed 50+ similar projects with an average 4.9★ rating
- I understand the importance of clear communication and meeting deadlines

**My approach:**
1. Deep-dive into your requirements in the first 24 hours
2. Deliver a detailed strategy/plan before execution begins
3. Weekly progress updates with measurable results
4. Revisions until you're 100% satisfied

**What you'll get:**
- Professional, results-driven work tailored to your goals
- Clear reporting and transparent communication
- On-time delivery, every time

I'd love to discuss this further. When are you available for a quick call?

Best regards,
[Your Name]`)
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Wand2 size={18} className="text-[#6C47FF]" />
        <h3 className="font-semibold text-[#F0EFFF]">AI Proposal Writer</h3>
      </div>
      <div className="space-y-3">
        <Textarea label="Paste job description" value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the full job description here..." rows={4} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#9494B0]">Tone</label>
          <div className="flex gap-2">
            {['Professional', 'Friendly', 'Bold'].map(t => (
              <button key={t} onClick={() => setTone(t)}
                className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  tone === t ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9494B0]'
                )}>{t}</button>
            ))}
          </div>
        </div>
        <Button size="lg" className="w-full" onClick={generate} disabled={loading || !jobDesc.trim()}>
          {loading ? '✦ Writing proposal...' : '✦ Generate Proposal'}
        </Button>
        {proposal && (
          <div className="relative">
            <div className="bg-[#0D0D14] border border-[#2A2A3A] rounded-lg p-4 text-xs text-[#9494B0] leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-hide">
              {proposal}
            </div>
            <button onClick={copy} className="absolute top-2 right-2 p-1.5 rounded bg-[#1A1A24] border border-[#2A2A3A] text-[#9494B0] hover:text-[#F0EFFF] transition-all">
              {copied ? <Check size={13} className="text-[#00D97E]" /> : <Copy size={13} />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function RateCalculator() {
  const [skill, setSkill] = useState('SEO')
  const [exp, setExp] = useState('2')
  const [result, setResult] = useState<{ hourly: string; project: string } | null>(null)

  const calculate = () => {
    const base: Record<string, number> = { SEO: 35, 'Google Ads': 45, 'Meta Ads': 40, 'Content Writing': 25, 'Email Marketing': 30, 'Social Media': 28 }
    const expMult = [0.7, 1, 1.3, 1.7][Math.min(parseInt(exp), 3)]
    const hourly = Math.round((base[skill] || 35) * expMult)
    setResult({ hourly: `$${hourly}–$${hourly + 15}/hr`, project: `$${hourly * 8}–$${(hourly + 15) * 12}/project` })
  }

  return (
    <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={18} className="text-[#FFB547]" />
        <h3 className="font-semibold text-[#F0EFFF]">Rate Calculator</h3>
      </div>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#9494B0]">Primary skill</label>
          <select value={skill} onChange={e => setSkill(e.target.value)} className="h-9 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
            {['SEO', 'Google Ads', 'Meta Ads', 'Content Writing', 'Email Marketing', 'Social Media'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-[#9494B0]">Years of experience</label>
          <select value={exp} onChange={e => setExp(e.target.value)} className="h-9 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
            <option value="0">0–1 years</option>
            <option value="1">1–2 years</option>
            <option value="2">2–5 years</option>
            <option value="3">5+ years</option>
          </select>
        </div>
        <Button variant="secondary" size="md" className="w-full" onClick={calculate}>Calculate my rate</Button>
        {result && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1A1A24] rounded-lg p-3 text-center">
              <div className="text-xs text-[#5A5A78] mb-1">Hourly rate</div>
              <div className="font-mono font-bold text-[#00D97E] text-sm">{result.hourly}</div>
            </div>
            <div className="bg-[#1A1A24] rounded-lg p-3 text-center">
              <div className="text-xs text-[#5A5A78] mb-1">Per project</div>
              <div className="font-mono font-bold text-[#A78BFA] text-sm">{result.project}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FreelancingHub() {
  const [platform, setPlatform] = useState('All')
  const [type, setType] = useState('All')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'jobs' | 'proposal' | 'calculator'>('jobs')

  const filtered = JOBS.filter(j =>
    (platform === 'All' || j.platform === platform) &&
    (type === 'All' || j.type === type) &&
    (j.title.toLowerCase().includes(search.toLowerCase()) || j.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Freelancing Hub</h1>
        <p className="text-[#9494B0] text-sm">Find freelance jobs, write winning proposals, and calculate your rates.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#111118] border border-[#2A2A3A] rounded-xl p-1 w-fit">
        {[{ id: 'jobs', label: '💼 Job Listings' }, { id: 'proposal', label: '✦ Proposal Writer' }, { id: 'calculator', label: '💰 Rate Calculator' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              activeTab === t.id ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0] hover:text-[#F0EFFF]'
            )}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or skills..."
                  className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all" />
              </div>
              <div className="flex gap-2">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={cn('px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                      platform === p ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0]'
                    )}>{p}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filtered.map(job => (
                <div key={job.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 card-glow transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-[#F0EFFF] mb-1">{job.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', platformColor[job.platform])}>
                          {job.platform}
                        </span>
                        <span className="text-[10px] text-[#9494B0] bg-[#1A1A24] border border-[#2A2A3A] px-2 py-0.5 rounded-full">{job.type}</span>
                        <span className="text-xs text-[#5A5A78]">{job.posted}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-[#00D97E] text-sm">{job.budget}</div>
                    </div>
                  </div>
                  <p className="text-xs text-[#9494B0] mb-3 leading-relaxed">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {job.skills.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A24] border border-[#2A2A3A] text-[#9494B0]">{s}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('proposal')}>
                        <Wand2 size={13} /> Write Proposal
                      </Button>
                      <Button size="sm">
                        Apply <ExternalLink size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar tips */}
          <div className="space-y-4">
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">💡 Today's Success Tips</h3>
              <div className="space-y-3">
                {['Personalise every proposal — generic ones get ignored', 'Apply within the first 2 hours of posting for 3× more responses', 'Include 1-2 specific examples from your portfolio', 'Ask a smart question to show you read the brief'].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#9494B0]">
                    <span className="text-[#6C47FF] font-bold mt-0.5">{i + 1}.</span> {tip}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">📄 Quick Tools</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setActiveTab('proposal')}>
                  <Wand2 size={14} /> AI Proposal Writer
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setActiveTab('calculator')}>
                  <Calculator size={14} /> Rate Calculator
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <FileText size={14} /> Contract Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'proposal' && (
        <div className="max-w-2xl">
          <ProposalWriter />
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="max-w-md">
          <RateCalculator />
        </div>
      )}
    </div>
  )
}
