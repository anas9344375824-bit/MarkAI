import { useState } from 'react'
import { Dna, Download, RefreshCw, Check, Palette, Star } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const ARCHETYPES = [
  { id: 'hero', name: 'The Hero', emoji: '⚔️', desc: 'Courageous, bold, determined. Inspires others to overcome challenges.', brands: 'Nike, FedEx, Duracell', color: '#FF6B6B' },
  { id: 'explorer', name: 'The Explorer', emoji: '🧭', desc: 'Adventurous, independent, pioneering. Seeks new experiences.', brands: 'Jeep, Patagonia, REI', color: '#FFB547' },
  { id: 'sage', name: 'The Sage', emoji: '🦉', desc: 'Wise, knowledgeable, trusted advisor. Shares expertise freely.', brands: 'Google, BBC, Harvard', color: '#00C8FF' },
  { id: 'innocent', name: 'The Innocent', emoji: '🌸', desc: 'Optimistic, pure, simple. Believes in goodness and simplicity.', brands: 'Dove, Coca-Cola, Disney', color: '#00D97E' },
  { id: 'creator', name: 'The Creator', emoji: '🎨', desc: 'Imaginative, innovative, expressive. Creates things of lasting value.', brands: 'Apple, LEGO, Adobe', color: '#A78BFA' },
  { id: 'ruler', name: 'The Ruler', emoji: '👑', desc: 'Authoritative, responsible, organised. Creates order from chaos.', brands: 'Mercedes, Rolex, Microsoft', color: '#FFB547' },
  { id: 'caregiver', name: 'The Caregiver', emoji: '💝', desc: 'Nurturing, generous, compassionate. Protects and cares for others.', brands: 'Johnson & Johnson, UNICEF', color: '#FF6B9D' },
  { id: 'jester', name: 'The Jester', emoji: '🎭', desc: 'Playful, humorous, spontaneous. Brings joy and lightness.', brands: 'Old Spice, M&Ms, Skittles', color: '#FFB547' },
  { id: 'lover', name: 'The Lover', emoji: '❤️', desc: 'Passionate, intimate, sensual. Creates connections and belonging.', brands: 'Chanel, Victoria\'s Secret', color: '#FF6B6B' },
  { id: 'everyman', name: 'The Everyman', emoji: '🤝', desc: 'Relatable, down-to-earth, friendly. Belongs to the community.', brands: 'IKEA, Target, Budweiser', color: '#9494B0' },
  { id: 'magician', name: 'The Magician', emoji: '✨', desc: 'Transformative, visionary, charismatic. Makes dreams come true.', brands: 'Disney, Tesla, Dyson', color: '#6C47FF' },
  { id: 'outlaw', name: 'The Outlaw', emoji: '🔥', desc: 'Rebellious, disruptive, revolutionary. Breaks the rules.', brands: 'Harley-Davidson, Virgin', color: '#FF6B6B' },
]

const QUIZ_QUESTIONS = [
  { q: 'Your brand\'s primary goal is to:', options: ['Inspire and empower customers', 'Discover and explore new possibilities', 'Share knowledge and wisdom', 'Create joy and happiness'] },
  { q: 'Your brand voice is:', options: ['Bold and confident', 'Adventurous and free', 'Authoritative and wise', 'Warm and friendly'] },
  { q: 'Customers choose you because:', options: ['You help them achieve their goals', 'You offer something unique', 'You\'re the trusted expert', 'You make them feel good'] },
  { q: 'Your brand\'s biggest strength is:', options: ['Courage and determination', 'Innovation and creativity', 'Knowledge and expertise', 'Reliability and care'] },
]

const ARCHETYPE_MAP: Record<string, string[]> = {
  '0000': ['hero', 'ruler'], '0001': ['hero', 'caregiver'], '0010': ['sage', 'ruler'],
  '0011': ['caregiver', 'innocent'], '0100': ['explorer', 'creator'], '0101': ['explorer', 'jester'],
  '0110': ['sage', 'creator'], '0111': ['everyman', 'caregiver'], '1000': ['hero', 'magician'],
  '1001': ['lover', 'caregiver'], '1010': ['sage', 'magician'], '1011': ['innocent', 'everyman'],
  '1100': ['creator', 'magician'], '1101': ['jester', 'lover'], '1110': ['outlaw', 'creator'],
  '1111': ['magician', 'explorer'],
}

export default function BrandDNABuilder() {
  const [step, setStep] = useState<'quiz' | 'result'>('quiz')
  const [answers, setAnswers] = useState<number[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [dna, setDna] = useState<{ primary: typeof ARCHETYPES[0]; secondary: typeof ARCHETYPES[0] } | null>(null)

  const answer = (idx: number) => {
    const newAnswers = [...answers, idx]
    setAnswers(newAnswers)
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      const key = newAnswers.map(a => a > 1 ? '1' : '0').join('')
      const archetypeIds = ARCHETYPE_MAP[key] || ['hero', 'creator']
      const primary = ARCHETYPES.find(a => a.id === archetypeIds[0]) || ARCHETYPES[0]
      const secondary = ARCHETYPES.find(a => a.id === archetypeIds[1]) || ARCHETYPES[1]
      setDna({ primary, secondary })
      setStep('result')
    }
  }

  const reset = () => { setStep('quiz'); setAnswers([]); setCurrentQ(0); setDna(null) }

  const COLOR_MEANINGS: Record<string, { meaning: string; avoid: string }> = {
    '#6C47FF': { meaning: 'Trust, creativity, wisdom, luxury', avoid: 'Can feel cold if overused' },
    '#00D97E': { meaning: 'Growth, health, success, nature', avoid: 'Avoid in finance (can mean inexperience)' },
    '#FF6B6B': { meaning: 'Energy, passion, urgency, excitement', avoid: 'Overuse creates anxiety' },
    '#FFB547': { meaning: 'Optimism, warmth, creativity, caution', avoid: 'Yellow = cowardice in some cultures' },
    '#00C8FF': { meaning: 'Trust, calm, professionalism, technology', avoid: 'Can feel cold in emotional contexts' },
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Brand DNA Builder</h1>
        <p className="text-[#9494B0] text-sm">Discover your brand archetype, build your identity, and export brand guidelines.</p>
      </div>

      {step === 'quiz' && (
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-[#9494B0]">Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} className={cn('w-8 h-1.5 rounded-full transition-all', i <= currentQ ? 'bg-[#6C47FF]' : 'bg-[#2A2A3A]')} />
              ))}
            </div>
          </div>
          <h2 className="font-display font-bold text-2xl mb-8">{QUIZ_QUESTIONS[currentQ].q}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
              <button key={i} onClick={() => answer(i)}
                className="p-4 rounded-xl border border-[#2A2A3A] bg-[#1A1A24] text-left text-sm text-[#9494B0] hover:border-[#6C47FF] hover:text-[#F0EFFF] hover:bg-[#6C47FF10] transition-all">
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && dna && (
        <div className="space-y-6">
          {/* DNA Result */}
          <div className="bg-gradient-to-r from-[#6C47FF15] to-[#00C8FF10] border border-[#6C47FF30] rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">{dna.primary.emoji}{dna.secondary.emoji}</div>
            <h2 className="font-display font-bold text-2xl mb-2">
              Your brand is <span className="text-[#A78BFA]">{dna.primary.name}</span> + <span className="text-[#00C8FF]">{dna.secondary.name}</span>
            </h2>
            <p className="text-sm text-[#9494B0] max-w-lg mx-auto">{dna.primary.desc} Combined with {dna.secondary.desc.toLowerCase()}</p>
          </div>

          {/* Archetypes detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{ archetype: dna.primary, label: 'Primary Archetype' }, { archetype: dna.secondary, label: 'Secondary Archetype' }].map(({ archetype, label }) => (
              <div key={archetype.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <div className="text-xs text-[#5A5A78] mb-2 uppercase tracking-wide">{label}</div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{archetype.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-[#F0EFFF]">{archetype.name}</h3>
                    <p className="text-xs text-[#5A5A78]">Similar brands: {archetype.brands}</p>
                  </div>
                </div>
                <p className="text-sm text-[#9494B0]">{archetype.desc}</p>
              </div>
            ))}
          </div>

          {/* Color psychology */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
            <h3 className="font-semibold text-[#F0EFFF] mb-4 flex items-center gap-2"><Palette size={16} className="text-[#A78BFA]" /> Color Psychology for Your Brand</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(COLOR_MEANINGS).map(([color, data]) => (
                <div key={color} className="flex items-start gap-3 p-3 rounded-lg bg-[#1A1A24]">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: color }} />
                  <div>
                    <div className="text-xs font-medium text-[#F0EFFF] mb-0.5">{data.meaning}</div>
                    <div className="text-[10px] text-[#FF6B6B]">⚠️ {data.avoid}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content themes */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
            <h3 className="font-semibold text-[#F0EFFF] mb-3">📝 Content Themes for Your Brand DNA</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                `${dna.primary.name} stories — show transformation`,
                `Behind-the-scenes authenticity`,
                `Customer success narratives`,
                `Expert insights and thought leadership`,
                `Community and belonging content`,
                `Challenge and achievement posts`,
              ].map((theme, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#1A1A24] text-xs text-[#9494B0]">
                  <Check size={11} className="text-[#00D97E] mb-1" />
                  {theme}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" size="lg" className="flex-1" onClick={reset}>
              <RefreshCw size={15} /> Retake quiz
            </Button>
            <Button size="lg" className="flex-1">
              <Download size={15} /> Export Brand Guidelines PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
