import { useState } from 'react'
import { Globe, AlertTriangle, CheckCircle, Copy, Check, Wand2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'

const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
]

const CULTURAL_DATA: Record<string, { tone: string; colorWarnings: string[]; phraseAlerts: string[]; adaptation: string }> = {
  IN: { tone: 'Respectful, relationship-first, family values', colorWarnings: ['White = mourning in some regions', 'Saffron = sacred, use carefully'], phraseAlerts: ['"Cheap" can be offensive — use "affordable"', 'Avoid aggressive sales language'], adaptation: 'Emphasise trust, family benefits, and long-term value. Use respectful language. Reference community and collective benefit.' },
  US: { tone: 'Direct, benefit-focused, individual empowerment', colorWarnings: ['No major color restrictions', 'Red = urgency/sale (positive)'], phraseAlerts: ['Avoid "scheme" — use "program"', '"Quite good" sounds weak — be bold'], adaptation: 'Lead with benefits and ROI. Use direct, confident language. Emphasise personal success and individual achievement.' },
  JP: { tone: 'Formal, humble, quality-focused, group harmony', colorWarnings: ['White = purity (positive)', 'Red = danger or passion — use carefully'], phraseAlerts: ['Avoid boastful claims', 'Never use aggressive urgency tactics'], adaptation: 'Focus on quality, craftsmanship, and reliability. Use formal language. Emphasise group benefit and social harmony.' },
  DE: { tone: 'Precise, factual, engineering-minded, no hype', colorWarnings: ['No major restrictions', 'Avoid excessive bright colors'], phraseAlerts: ['Avoid superlatives without proof', '"Best" requires substantiation'], adaptation: 'Lead with facts, specifications, and data. Avoid emotional language. Germans value precision and honesty over enthusiasm.' },
  AE: { tone: 'Formal, luxury-oriented, relationship-based', colorWarnings: ['Green = Islam (positive)', 'Avoid yellow — associated with cowardice'], phraseAlerts: ['Avoid alcohol/pork references', 'Ramadan messaging requires sensitivity'], adaptation: 'Emphasise luxury, exclusivity, and prestige. Use formal Arabic greetings if possible. Respect Islamic values.' },
  BR: { tone: 'Warm, emotional, relationship-driven, vibrant', colorWarnings: ['Purple = mourning', 'Yellow+green = national pride (positive)'], phraseAlerts: ['Avoid "cheap" — use "accessible"', 'Informal tone is welcomed'], adaptation: 'Use warm, emotional language. Emphasise community and relationships. Brazilians respond to passion and authenticity.' },
}

function adaptContent(text: string, countryCode: string): string {
  const data = CULTURAL_DATA[countryCode]
  if (!data) return text

  const adaptations: Record<string, (t: string) => string> = {
    IN: t => t.replace(/cheap/gi, 'affordable').replace(/buy now/gi, 'explore our trusted solution').replace(/limited time/gi, 'special offer'),
    US: t => t.replace(/quite good/gi, 'exceptional').replace(/affordable/gi, 'great value').replace(/we think/gi, 'proven to'),
    JP: t => t.replace(/best in class/gi, 'crafted with precision').replace(/buy now/gi, 'discover more').replace(/amazing/gi, 'reliable'),
    DE: t => t.replace(/amazing/gi, 'proven').replace(/incredible/gi, 'verified').replace(/best/gi, 'leading'),
    AE: t => t.replace(/cheap/gi, 'exclusive value').replace(/buy now/gi, 'request consultation').replace(/sale/gi, 'special offer'),
    BR: t => t.replace(/purchase/gi, 'join us').replace(/buy/gi, 'get yours').replace(/product/gi, 'solution'),
  }

  const fn = adaptations[countryCode]
  return fn ? fn(text) : text
}

export default function CulturalAdapter() {
  const [content, setContent] = useState('')
  const [selected, setSelected] = useState<string[]>(['US', 'IN'])
  const [results, setResults] = useState<Record<string, { adapted: string; warnings: string[]; tone: string }> | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const toggleCountry = (code: string) =>
    setSelected(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])

  const adapt = async () => {
    if (!content.trim() || selected.length === 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    const out: typeof results = {}
    selected.forEach(code => {
      const data = CULTURAL_DATA[code]
      out![code] = {
        adapted: adaptContent(content, code),
        warnings: data?.colorWarnings || [],
        tone: data?.tone || 'Standard tone',
      }
    })
    setResults(out)
    setLoading(false)
  }

  const copy = (code: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Cultural Marketing Adapter</h1>
        <p className="text-[#9494B0] text-sm">Not translation — cultural adaptation. Make your message resonate globally.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 space-y-4">
            <Textarea label="Your ad copy or content" value={content} onChange={e => setContent(e.target.value)}
              placeholder="Paste your ad copy, email, or marketing content here..." rows={5} />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#9494B0]">Target countries ({selected.length} selected)</label>
              <div className="grid grid-cols-3 gap-2">
                {COUNTRIES.map(c => (
                  <button key={c.code} onClick={() => toggleCountry(c.code)}
                    className={cn('flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs border transition-all',
                      selected.includes(c.code) ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9494B0] hover:border-[#3D3D55]')}>
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button size="xl" onClick={adapt} disabled={loading || !content.trim() || selected.length === 0}>
              {loading ? '⟳ Adapting...' : <><Globe size={16} /> Adapt for {selected.length} {selected.length === 1 ? 'country' : 'countries'}</>}
            </Button>
          </div>

          {/* Cultural tips */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">💡 Cultural Marketing Tips</h3>
            <div className="space-y-2 text-xs text-[#9494B0]">
              <p>• <strong className="text-[#F0EFFF]">India:</strong> Family values + trust + affordability</p>
              <p>• <strong className="text-[#F0EFFF]">Japan:</strong> Quality + precision + group harmony</p>
              <p>• <strong className="text-[#F0EFFF]">Germany:</strong> Facts + data + no hype</p>
              <p>• <strong className="text-[#F0EFFF]">UAE:</strong> Luxury + formality + respect</p>
              <p>• <strong className="text-[#F0EFFF]">Brazil:</strong> Emotion + warmth + community</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!results && !loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-semibold text-[#F0EFFF] mb-2">Select countries and adapt your content</h3>
              <p className="text-sm text-[#9494B0]">Get culturally-adapted versions with tone guidance and sensitivity alerts.</p>
            </div>
          )}

          {loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="flex gap-1.5 justify-center mb-4">
                {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
              <p className="text-[#9494B0]">Adapting content for {selected.length} cultures...</p>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              {selected.map(code => {
                const country = COUNTRIES.find(c => c.code === code)
                const r = results[code]
                const cultural = CULTURAL_DATA[code]
                if (!r || !country) return null
                return (
                  <div key={code} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <h3 className="font-semibold text-[#F0EFFF]">{country.name}</h3>
                          <p className="text-xs text-[#5A5A78]">{r.tone}</p>
                        </div>
                      </div>
                      <button onClick={() => copy(code, r.adapted)} className="p-1.5 rounded hover:bg-[#1A1A24] text-[#9494B0] hover:text-[#F0EFFF] transition-all">
                        {copied === code ? <Check size={15} className="text-[#00D97E]" /> : <Copy size={15} />}
                      </button>
                    </div>

                    <div className="bg-[#0D0D14] border border-[#2A2A3A] rounded-lg p-3 mb-3 text-sm text-[#C8C8E0] leading-relaxed">
                      {r.adapted}
                    </div>

                    {cultural && (
                      <div className="space-y-2">
                        {cultural.colorWarnings.length > 0 && (
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-[#FFB54710] border border-[#FFB54730]">
                            <AlertTriangle size={13} className="text-[#FFB547] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#FFB547]">
                              <strong>Color warnings:</strong> {cultural.colorWarnings.join(' · ')}
                            </div>
                          </div>
                        )}
                        {cultural.phraseAlerts.length > 0 && (
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-[#FF6B6B10] border border-[#FF6B6B30]">
                            <AlertTriangle size={13} className="text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#FF6B6B]">
                              <strong>Phrase alerts:</strong> {cultural.phraseAlerts.join(' · ')}
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-[#6C47FF10] border border-[#6C47FF30]">
                          <CheckCircle size={13} className="text-[#A78BFA] flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-[#A78BFA]">{cultural.adaptation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
