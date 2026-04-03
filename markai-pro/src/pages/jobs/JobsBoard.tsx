import { useState } from 'react'
import { Search, MapPin, DollarSign, Bookmark, BookmarkCheck, ExternalLink, Wand2, Upload, Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'

const JOBS = [
  { id: '1', company: '🚀', companyName: 'TechStart Inc', title: 'Senior SEO Manager', salary: '$70k–$95k', location: 'Remote', type: 'Full-time', level: 'Senior', skills: ['SEO', 'Technical SEO', 'Analytics', 'Content Strategy'], posted: '1 day ago', remote: true },
  { id: '2', company: '🛍️', companyName: 'ShopGrow', title: 'Performance Marketing Manager', salary: '$65k–$85k', location: 'New York, NY', type: 'Full-time', level: 'Mid', skills: ['Google Ads', 'Meta Ads', 'ROAS', 'E-commerce'], posted: '2 days ago', remote: false },
  { id: '3', company: '📧', companyName: 'MailFlow', title: 'Email Marketing Specialist', salary: '$55k–$70k', location: 'Remote', type: 'Full-time', level: 'Mid', skills: ['Email Marketing', 'Klaviyo', 'Copywriting', 'A/B Testing'], posted: '3 days ago', remote: true },
  { id: '4', company: '📊', companyName: 'DataDriven Co', title: 'Marketing Analytics Lead', salary: '$80k–$110k', location: 'San Francisco, CA', type: 'Full-time', level: 'Senior', skills: ['GA4', 'Looker', 'SQL', 'Attribution'], posted: '4 days ago', remote: true },
  { id: '5', company: '✍️', companyName: 'ContentFirst', title: 'Content Marketing Manager', salary: '$60k–$80k', location: 'Remote', type: 'Full-time', level: 'Mid', skills: ['Content Strategy', 'SEO Writing', 'Editorial', 'WordPress'], posted: '5 days ago', remote: true },
  { id: '6', company: '🎯', companyName: 'GrowthLab', title: 'Growth Marketing Director', salary: '$110k–$140k', location: 'Austin, TX', type: 'Full-time', level: 'Director', skills: ['Growth Hacking', 'Paid Media', 'CRO', 'Product Marketing'], posted: '1 week ago', remote: false },
]

const LEVELS = ['All', 'Junior', 'Mid', 'Senior', 'Director']
const TYPES = ['All', 'Full-time', 'Part-time', 'Contract']

function CoverLetterGenerator() {
  const [jobDesc, setJobDesc] = useState('')
  const [resume, setResume] = useState('')
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!jobDesc.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLetter(`Dear Hiring Manager,

I am excited to apply for this position at your company. After reviewing the job description carefully, I am confident that my background and skills make me an excellent candidate.

**Why I'm a strong fit:**

Throughout my career, I have developed deep expertise in the areas highlighted in your job posting. My experience includes driving measurable results through data-driven strategies, cross-functional collaboration, and a relentless focus on performance metrics.

**Key achievements relevant to this role:**
• Increased organic traffic by 180% in 12 months through strategic SEO initiatives
• Managed $500k+ in annual ad spend with consistent 4× ROAS
• Built and led a team of 5 marketing specialists across multiple channels

**What I bring to your team:**

I thrive in fast-paced environments where creativity meets analytical thinking. I'm passionate about staying ahead of industry trends and translating insights into actionable strategies that drive real business outcomes.

I would welcome the opportunity to discuss how my experience aligns with your team's goals. I'm available for an interview at your earliest convenience.

Thank you for your consideration.

Sincerely,
[Your Name]`)
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Wand2 size={18} className="text-[#6C47FF]" />
        <h3 className="font-semibold text-[#F0EFFF]">AI Cover Letter Generator</h3>
      </div>
      <Textarea label="Job description" value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the job description..." rows={4} />
      <Textarea label="Your resume / key experience (optional)" value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume or key achievements..." rows={3} />
      <Button size="lg" className="w-full" onClick={generate} disabled={loading || !jobDesc.trim()}>
        {loading ? '✦ Writing cover letter...' : '✦ Generate Cover Letter'}
      </Button>
      {letter && (
        <div className="relative">
          <div className="bg-[#0D0D14] border border-[#2A2A3A] rounded-lg p-4 text-xs text-[#9494B0] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto scrollbar-hide">
            {letter}
          </div>
          <button onClick={copy} className="absolute top-2 right-2 p-1.5 rounded bg-[#1A1A24] border border-[#2A2A3A] text-[#9494B0] hover:text-[#F0EFFF] transition-all">
            {copied ? <Check size={13} className="text-[#00D97E]" /> : <Check size={13} />}
          </button>
        </div>
      )}
    </div>
  )
}

export default function JobsBoard() {
  const [level, setLevel] = useState('All')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'jobs' | 'cover-letter'>('jobs')

  const filtered = JOBS.filter(j =>
    (level === 'All' || j.level === level) &&
    (!remoteOnly || j.remote) &&
    (j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
  )

  const toggleBookmark = (id: string) =>
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Jobs Board</h1>
        <p className="text-[#9494B0] text-sm">Full-time & remote digital marketing jobs. AI-powered application tools.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-[#111118] border border-[#2A2A3A] rounded-xl p-1 w-fit">
        {[{ id: 'jobs', label: '💼 Job Listings' }, { id: 'cover-letter', label: '✦ Cover Letter AI' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === t.id ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0] hover:text-[#F0EFFF]'
            )}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, companies, skills..."
                  className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-[#111118] border border-[#2A2A3A] text-sm text-[#9494B0] hover:border-[#3D3D55] transition-all">
                <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)} className="accent-[#6C47FF]" />
                Remote only
              </label>
            </div>

            <div className="flex gap-2 flex-wrap mb-5">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    level === l ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0]'
                  )}>{l}</button>
              ))}
            </div>

            <div className="space-y-4">
              {filtered.map(job => (
                <div key={job.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 card-glow transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1A1A24] flex items-center justify-center text-2xl flex-shrink-0">{job.company}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-[#F0EFFF]">{job.title}</h3>
                          <p className="text-sm text-[#9494B0]">{job.companyName}</p>
                        </div>
                        <button onClick={() => toggleBookmark(job.id)} className="text-[#5A5A78] hover:text-[#FFB547] transition-colors ml-2">
                          {bookmarks.includes(job.id) ? <BookmarkCheck size={16} className="text-[#FFB547]" /> : <Bookmark size={16} />}
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-[#00D97E]"><DollarSign size={11} />{job.salary}</span>
                        <span className="flex items-center gap-1 text-xs text-[#9494B0]"><MapPin size={11} />{job.location}</span>
                        {job.remote && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00D97E15] text-[#00D97E] border border-[#00D97E30]">Remote</span>}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A24] border border-[#2A2A3A] text-[#9494B0]">{job.level}</span>
                        <span className="text-xs text-[#5A5A78] ml-auto">{job.posted}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                          {job.skills.slice(0, 3).map(s => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A24] border border-[#2A2A3A] text-[#9494B0]">{s}</span>
                          ))}
                          {job.skills.length > 3 && <span className="text-[10px] text-[#5A5A78]">+{job.skills.length - 3}</span>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setActiveTab('cover-letter')}>
                            <Wand2 size={12} /> Cover Letter
                          </Button>
                          <Button size="sm">Apply <ExternalLink size={12} /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">📌 Saved Jobs</h3>
              {bookmarks.length === 0 ? (
                <p className="text-xs text-[#5A5A78] text-center py-3">No saved jobs yet.</p>
              ) : (
                <div className="space-y-2">
                  {JOBS.filter(j => bookmarks.includes(j.id)).map(j => (
                    <div key={j.id} className="text-xs text-[#9494B0] hover:text-[#F0EFFF] cursor-pointer transition-colors">{j.title} — {j.companyName}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">🔔 Job Alerts</h3>
              <p className="text-xs text-[#9494B0] mb-3">Get notified when new jobs match your criteria.</p>
              <input placeholder="Your email" className="w-full h-9 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all mb-2" />
              <Button variant="secondary" size="sm" className="w-full">Set up alert</Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cover-letter' && (
        <div className="max-w-2xl">
          <CoverLetterGenerator />
        </div>
      )}
    </div>
  )
}
