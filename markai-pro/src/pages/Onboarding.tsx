import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { cn } from '../lib/utils'

const roles = [
  { id: 'solo', icon: '🎯', title: 'Solo Marketer', desc: 'I manage marketing for one brand' },
  { id: 'freelancer', icon: '💼', title: 'Freelancer', desc: 'I work with multiple clients' },
  { id: 'agency', icon: '🏢', title: 'Agency Owner', desc: 'I run a marketing agency' },
  { id: 'brand', icon: '🛍️', title: 'Brand / Business', desc: 'I own or manage a business' },
]

const platforms = ['Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube', 'Google Ads', 'Meta Ads', 'Email', 'Blog/SEO', 'Twitter/X']

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const togglePlatform = (p: string) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  return (
    <div className="min-h-screen bg-[#08080C] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-[#6C47FF] flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg">
          <span className="text-[#6C47FF]">Mark</span>AI Pro
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
              s < step ? 'bg-[#6C47FF] text-white' : s === step ? 'bg-[#6C47FF] text-white ring-4 ring-[#6C47FF30]' : 'bg-[#1A1A24] text-[#5A5A78] border border-[#2A2A3A]'
            )}>
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < 4 && <div className={cn('w-12 h-0.5', s < step ? 'bg-[#6C47FF]' : 'bg-[#2A2A3A]')} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-xl">
        {step === 1 && (
          <div>
            <h2 className="font-display font-bold text-3xl text-center mb-2">What's your role?</h2>
            <p className="text-[#9494B0] text-center mb-8">We'll personalise MarkAI Pro for you.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {roles.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)}
                  className={cn(
                    'relative p-5 rounded-xl border text-left transition-all duration-200',
                    role === r.id ? 'border-[#6C47FF] bg-[#6C47FF15]' : 'border-[#2A2A3A] bg-[#111118] hover:border-[#3D3D55]'
                  )}>
                  {role === r.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#6C47FF] flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className="text-2xl mb-2">{r.icon}</div>
                  <div className="font-semibold text-sm text-[#F0EFFF] mb-1">{r.title}</div>
                  <div className="text-xs text-[#9494B0]">{r.desc}</div>
                </button>
              ))}
            </div>
            <Button size="xl" disabled={!role} onClick={() => setStep(2)}>Continue →</Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display font-bold text-3xl text-center mb-2">Where do you market?</h2>
            <p className="text-[#9494B0] text-center mb-8">Select all platforms you use.</p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {platforms.map(p => (
                <button key={p} onClick={() => togglePlatform(p)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200',
                    selectedPlatforms.includes(p) ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0] hover:border-[#3D3D55]'
                  )}>
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button size="lg" className="flex-1" disabled={selectedPlatforms.length === 0} onClick={() => setStep(3)}>Continue →</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display font-bold text-3xl text-center mb-2">Tell us about your brand</h2>
            <p className="text-[#9494B0] text-center mb-8">This helps MarkAI Pro write in your voice.</p>
            <div className="space-y-4 mb-8">
              <Input label="Brand name" placeholder="e.g. Bloom Beauty Co" />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#9494B0]">Industry</label>
                <select className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
                  <option value="">Select your industry</option>
                  {['SaaS / Software', 'E-commerce', 'Health & Fitness', 'Beauty & Cosmetics', 'Finance', 'Real Estate', 'Education', 'Food & Beverage', 'Travel', 'Fashion', 'Marketing Agency', 'Consulting'].map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <Textarea label="Brand voice" placeholder="Describe your tone in a few words (e.g. friendly, professional, bold, conversational)" rows={3} />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(2)}>Back</Button>
              <Button size="lg" className="flex-1" onClick={() => setStep(4)}>Continue →</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h2 className="font-display font-bold text-3xl mb-3">You're all set!</h2>
            <p className="text-[#9494B0] mb-8">MarkAI Pro is ready to supercharge your marketing.</p>
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 mb-8 text-left space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-[#00D97E]" />
                <span className="text-[#9494B0]">Role configured: <span className="text-[#F0EFFF]">{roles.find(r => r.id === role)?.title}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-[#00D97E]" />
                <span className="text-[#9494B0]">{selectedPlatforms.length} platforms connected</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-[#00D97E]" />
                <span className="text-[#9494B0]">Brand voice profile created</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-[#00D97E]" />
                <span className="text-[#9494B0]">26 tools unlocked and ready</span>
              </div>
            </div>
            <Button size="xl" onClick={() => navigate('/dashboard')}>
              Enter MarkAI Pro →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
