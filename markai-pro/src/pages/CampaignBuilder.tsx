import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { cn } from '../lib/utils'
import { sleep } from '../lib/utils'

const goals = ['Brand Awareness', 'Lead Generation', 'Sales/Conversion', 'Retention', 'Product Launch', 'Event Promotion']

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸', creates: '5 captions + 3 story scripts + 5 hashtag sets' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', creates: '4 posts + 2 articles + 3 carousels' },
  { id: 'facebook', name: 'Facebook', icon: '👥', creates: '4 posts + 2 event descriptions' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', creates: '5 video scripts + hooks' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', creates: '2 video scripts + descriptions + tags' },
  { id: 'google-ads', name: 'Google Ads', icon: '🔍', creates: '3 headline variants + descriptions + extensions' },
  { id: 'meta-ads', name: 'Meta Ads', icon: '📣', creates: '4 ad copy variants + CTAs' },
  { id: 'email', name: 'Email Newsletter', icon: '📧', creates: 'Welcome email + 3-part drip + subject lines' },
  { id: 'blog', name: 'Blog / SEO', icon: '✍️', creates: '2 full articles + meta descriptions' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', creates: '10 tweets + 2 thread scripts' },
]

const steps = ['Campaign Brief', 'Platform Selection', 'Review Plan', 'Generating', 'Campaign Ready']

export default function CampaignBuilder() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [currentPlatform, setCurrentPlatform] = useState('')

  const togglePlatform = (id: string) => setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const totalContent = selectedPlatforms.reduce((acc, pid) => {
    const p = platforms.find(p => p.id === pid)
    if (!p) return acc
    const nums = p.creates.match(/\d+/g)?.map(Number) || []
    return acc + nums.reduce((a, b) => a + b, 0)
  }, 0)

  const runGeneration = async () => {
    setStep(3)
    const selected = platforms.filter(p => selectedPlatforms.includes(p.id))
    for (let i = 0; i < selected.length; i++) {
      setCurrentPlatform(`Writing ${selected[i].name} content...`)
      setProgress(Math.round(((i + 1) / selected.length) * 100))
      await sleep(800)
    }
    setStep(4)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                i < step ? 'bg-[#6C47FF] text-white' : i === step ? 'bg-[#6C47FF] text-white ring-4 ring-[#6C47FF30]' : 'bg-[#1A1A24] text-[#5A5A78] border border-[#2A2A3A]'
              )}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={cn('flex-1 h-0.5 w-8 md:w-16', i < step ? 'bg-[#6C47FF]' : 'bg-[#2A2A3A]')} />}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl">{steps[step]}</h2>
        </div>
      </div>

      {/* Step 0: Brief */}
      {step === 0 && (
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 space-y-5">
          <Input label="Campaign name" placeholder="e.g. Q4 Black Friday Push" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Campaign goal</label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map(g => (
                <button key={g} onClick={() => setGoal(g)}
                  className={cn('px-3 py-2 rounded-lg text-sm border text-left transition-all', goal === g ? 'border-[#6C47FF] bg-[#6C47FF15] text-[#A78BFA]' : 'border-[#2A2A3A] text-[#9494B0] hover:border-[#3D3D55]')}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <Input label="Target audience" placeholder="e.g. E-commerce store owners aged 25-45" />
          <Textarea label="Key message" placeholder="The one thing you want people to feel, know, or do..." rows={3} />
          <Input label="Campaign budget (optional)" placeholder="e.g. $5,000" />
          <Button size="xl" disabled={!goal} onClick={() => setStep(1)}>
            Continue <ChevronRight size={18} />
          </Button>
        </div>
      )}

      {/* Step 1: Platforms */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {platforms.map(p => (
              <button key={p.id} onClick={() => togglePlatform(p.id)}
                className={cn(
                  'relative p-4 rounded-xl border text-left transition-all duration-200',
                  selectedPlatforms.includes(p.id) ? 'border-[#6C47FF] bg-[#6C47FF15]' : 'border-[#2A2A3A] bg-[#111118] hover:border-[#3D3D55]'
                )}>
                {selectedPlatforms.includes(p.id) && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#6C47FF] flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="font-medium text-sm text-[#F0EFFF]">{p.name}</div>
                <div className="text-xs text-[#5A5A78] mt-1">{p.creates}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(0)}>Back</Button>
            <Button size="lg" className="flex-1" disabled={selectedPlatforms.length === 0} onClick={() => setStep(2)}>
              Review Plan <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-[#F0EFFF]">MarkAI Pro will create:</h3>
              <span className="px-3 py-1 rounded-full bg-[#6C47FF20] text-[#A78BFA] border border-[#6C47FF40] text-sm font-medium">
                {totalContent} pieces of content
              </span>
            </div>
            <div className="space-y-3">
              {platforms.filter(p => selectedPlatforms.includes(p.id)).map(p => (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#1A1A24]">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <div className="font-medium text-sm text-[#F0EFFF]">For {p.name}:</div>
                    <div className="text-xs text-[#9494B0]">{p.creates}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Button>
            <Button size="lg" className="flex-1" onClick={runGeneration}>
              Looks good, generate it! 🚀
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 3 && (
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#2A2A3A]" />
            <div className="absolute inset-0 rounded-full border-4 border-[#6C47FF] border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#6C47FF]">{progress}%</div>
          </div>
          <h3 className="font-semibold text-[#F0EFFF] mb-2">Building your campaign...</h3>
          <p className="text-sm text-[#9494B0] mb-6">{currentPlatform}</p>
          <div className="h-2 bg-[#2A2A3A] rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="h-full bg-[#6C47FF] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-[#5A5A78] mt-4">Do not navigate away from this page</p>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#6C47FF15] to-[#00C8FF10] border border-[#6C47FF30] rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-display font-bold text-2xl mb-2">Campaign Ready!</h3>
            <p className="text-[#9494B0] text-sm">{totalContent} pieces of content created across {selectedPlatforms.length} platforms.</p>
          </div>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden">
            <div className="flex border-b border-[#2A2A3A] overflow-x-auto scrollbar-hide">
              {platforms.filter(p => selectedPlatforms.includes(p.id)).map((p, i) => (
                <button key={p.id} className={cn('px-4 py-3 text-sm whitespace-nowrap transition-colors', i === 0 ? 'text-[#A78BFA] border-b-2 border-[#6C47FF]' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A]">
                  <div className="text-sm text-[#F0EFFF] mb-2">Caption {i}: Ready to post your campaign? Here's a compelling Instagram caption that drives engagement and conversions...</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Copy</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="secondary" size="sm">Schedule</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="lg" className="flex-1">Download all as ZIP</Button>
            <Button size="lg" className="flex-1" onClick={() => navigate('/calendar')}>Schedule Campaign →</Button>
          </div>
        </div>
      )}
    </div>
  )
}
