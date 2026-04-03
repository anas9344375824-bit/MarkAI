import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { cn } from '../lib/utils'

const axes = [
  { label: 'Formal', opposite: 'Casual' },
  { label: 'Serious', opposite: 'Playful' },
  { label: 'Reserved', opposite: 'Bold' },
  { label: 'Traditional', opposite: 'Innovative' },
  { label: 'Technical', opposite: 'Simple' },
]

const STANDARD = `Just launched our new product! Check it out and let us know what you think. Link in bio. #product #launch #new`
const BRAND = `We've been building this for months — and it's finally here. 🚀 This isn't just a product launch. It's a statement. Drop a 🔥 if you're ready to see what we've been working on. #BoldMoves #Innovation`

export default function BrandVoice() {
  const [tab, setTab] = useState<'setup' | 'test'>('setup')
  const [sliders, setSliders] = useState([50, 50, 50, 50, 50])
  const [loveTags, setLoveTags] = useState(['authentic', 'bold', 'clear'])
  const [avoidTags, setAvoidTags] = useState(['synergy', 'leverage', 'disruptive'])
  const [loveInput, setLoveInput] = useState('')
  const [avoidInput, setAvoidInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [testOutput, setTestOutput] = useState(false)

  const addTag = (type: 'love' | 'avoid', val: string) => {
    if (!val.trim()) return
    if (type === 'love') { setLoveTags(p => [...p, val.trim()]); setLoveInput('') }
    else { setAvoidTags(p => [...p, val.trim()]); setAvoidInput('') }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Brand Voice Trainer</h1>
        <p className="text-[#9494B0]">Teach MarkAI Pro your brand's unique voice.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-[#111118] border border-[#2A2A3A] rounded-xl p-1 w-fit">
        {(['setup', 'test'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all', tab === t ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'setup' && (
        <div className="space-y-6">
          {/* Sliders */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
            <h3 className="font-semibold text-[#F0EFFF] mb-5">Brand Personality</h3>
            <div className="space-y-5">
              {axes.map((axis, i) => (
                <div key={axis.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={cn('font-medium', sliders[i] < 50 ? 'text-[#A78BFA]' : 'text-[#5A5A78]')}>{axis.label}</span>
                    <span className={cn('font-medium', sliders[i] > 50 ? 'text-[#A78BFA]' : 'text-[#5A5A78]')}>{axis.opposite}</span>
                  </div>
                  <input type="range" min={0} max={100} value={sliders[i]}
                    onChange={e => setSliders(prev => prev.map((v, j) => j === i ? +e.target.value : v))}
                    className="w-full accent-[#6C47FF]" />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Words we love', tags: loveTags, setTags: setLoveTags, input: loveInput, setInput: setLoveInput, type: 'love' as const, color: 'text-[#00D97E]', bg: 'bg-[#00D97E20] border-[#00D97E40]' },
              { label: 'Words we never use', tags: avoidTags, setTags: setAvoidTags, input: avoidInput, setInput: setAvoidInput, type: 'avoid' as const, color: 'text-[#FF6B6B]', bg: 'bg-[#FF6B6B20] border-[#FF6B6B40]' },
            ].map(({ label, tags, setTags, input, setInput, type, color, bg }) => (
              <div key={label} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <h3 className={cn('font-semibold text-sm mb-3', color)}>{label}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <span key={tag} className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border', bg, color)}>
                      {tag}
                      <button onClick={() => setTags(p => p.filter(t => t !== tag))} className="opacity-60 hover:opacity-100">×</button>
                    </span>
                  ))}
                </div>
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag(type, input)}
                  placeholder="Add word, press Enter"
                  className="w-full h-8 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-xs text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all"
                />
              </div>
            ))}
          </div>

          {/* Upload */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
            <h3 className="font-semibold text-[#F0EFFF] mb-2">Upload writing samples</h3>
            <p className="text-xs text-[#9494B0] mb-4">Upload 3-5 samples of your best content. AI will analyse and calibrate your voice automatically.</p>
            <div className="border-2 border-dashed border-[#2A2A3A] rounded-xl p-8 text-center hover:border-[#6C47FF40] transition-colors cursor-pointer">
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm text-[#9494B0]">Drag & drop files here, or <span className="text-[#6C47FF]">browse</span></p>
              <p className="text-xs text-[#5A5A78] mt-1">.txt, .docx, .pdf supported</p>
            </div>
          </div>

          <Button size="xl" onClick={() => setSaved(true)}>
            {saved ? '✓ Brand Voice Saved!' : 'Save Brand Voice'}
          </Button>
        </div>
      )}

      {tab === 'test' && (
        <div className="space-y-4">
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
            <Textarea label="Test prompt" placeholder="Write a short Instagram caption about launching a new product..." rows={3} />
            <Button className="mt-4" onClick={() => setTestOutput(true)}>
              Generate comparison
            </Button>
          </div>

          {testOutput && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <div className="text-xs text-[#5A5A78] font-medium mb-3 uppercase tracking-wide">Standard AI</div>
                <p className="text-sm text-[#9494B0] leading-relaxed">{STANDARD}</p>
              </div>
              <div className="bg-[#111118] border border-[#6C47FF40] rounded-xl p-5 shadow-[0_0_20px_#6C47FF10]">
                <div className="text-xs text-[#A78BFA] font-medium mb-3 uppercase tracking-wide">Your Brand Voice ✨</div>
                <p className="text-sm text-[#F0EFFF] leading-relaxed">{BRAND}</p>
                <div className="mt-3 pt-3 border-t border-[#2A2A3A]">
                  <p className="text-xs text-[#5A5A78]">Adjustments: Added bold tone, removed generic language, used brand vocabulary</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
