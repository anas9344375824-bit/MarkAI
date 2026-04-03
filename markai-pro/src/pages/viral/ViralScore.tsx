import { useState } from 'react'
import { Flame, Clock, TrendingUp, Zap, AlertCircle } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'

const PLATFORMS = ['Twitter/X', 'Instagram', 'LinkedIn', 'TikTok', 'Facebook']

const EMOTIONAL_TRIGGERS = ['Curiosity', 'Fear of Missing Out', 'Inspiration', 'Controversy', 'Humour', 'Surprise', 'Empathy', 'Urgency']

function analyzeVirality(text: string, platform: string) {
  const words = text.toLowerCase().split(/\s+/)
  const len = words.length

  const powerWords = ['secret', 'never', 'always', 'shocking', 'proven', 'free', 'instantly', 'guaranteed', 'exclusive', 'limited', 'breaking', 'revealed', 'warning', 'urgent', 'finally']
  const questionWords = ['how', 'why', 'what', 'when', 'who', 'which']
  const numberCount = (text.match(/\d+/g) || []).length
  const hasQuestion = text.includes('?')
  const hasEmoji = /\p{Emoji}/u.test(text)
  const powerWordCount = words.filter(w => powerWords.includes(w)).length
  const questionWordCount = words.filter(w => questionWords.includes(w)).length

  let score = 40
  if (len >= 15 && len <= 50) score += 10
  if (numberCount > 0) score += 8
  if (hasQuestion) score += 7
  if (hasEmoji) score += 5
  score += Math.min(powerWordCount * 6, 18)
  score += Math.min(questionWordCount * 4, 12)
  if (text.includes('\n')) score += 5

  const platformScores: Record<string, number> = {
    'Twitter/X': Math.min(100, score + (len < 30 ? 10 : -5)),
    'Instagram': Math.min(100, score + (hasEmoji ? 10 : 0)),
    'LinkedIn': Math.min(100, score + (text.includes('I ') ? 8 : 0)),
    'TikTok': Math.min(100, score + (len < 20 ? 12 : 0)),
    'Facebook': Math.min(100, score + (hasQuestion ? 8 : 0)),
  }

  const triggers = []
  if (powerWordCount > 0) triggers.push('Curiosity')
  if (hasQuestion) triggers.push('Curiosity')
  if (text.toLowerCase().includes('free') || text.toLowerCase().includes('limited')) triggers.push('Fear of Missing Out')
  if (numberCount > 1) triggers.push('Surprise')
  if (text.toLowerCase().includes('you') || text.toLowerCase().includes('your')) triggers.push('Empathy')
  if (triggers.length === 0) triggers.push('Inspiration')

  const suggestions = []
  if (!hasQuestion) suggestions.push({ text: 'Add a question to boost engagement', impact: '+7 points' })
  if (!hasEmoji) suggestions.push({ text: 'Add 1-2 relevant emojis', impact: '+5 points' })
  if (numberCount === 0) suggestions.push({ text: 'Include a specific number or statistic', impact: '+8 points' })
  if (powerWordCount === 0) suggestions.push({ text: 'Add a power word (e.g. "secret", "proven", "shocking")', impact: '+6 points' })
  if (len > 60) suggestions.push({ text: 'Shorten to under 50 words for better readability', impact: '+10 points' })

  const bestTime: Record<string, string> = {
    'Twitter/X': '9am–11am or 7pm–9pm weekdays',
    'Instagram': 'Tuesday–Friday, 11am–1pm',
    'LinkedIn': 'Tuesday–Thursday, 8am–10am',
    'TikTok': 'Evening 7pm–9pm, any day',
    'Facebook': 'Wednesday 1pm–3pm',
  }

  return {
    overallScore: Math.min(100, score),
    platformScores,
    triggers,
    suggestions,
    bestTime: bestTime[platform],
    radarData: Object.entries(platformScores).map(([p, s]) => ({ platform: p.split('/')[0], score: s })),
  }
}

export default function ViralScorePredictor() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('Twitter/X')
  const [result, setResult] = useState<ReturnType<typeof analyzeVirality> | null>(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!content.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setResult(analyzeVirality(content, platform))
    setLoading(false)
  }

  const scoreColor = (s: number) => s >= 75 ? 'text-[#00D97E]' : s >= 50 ? 'text-[#FFB547]' : 'text-[#FF6B6B]'
  const scoreLabel = (s: number) => s >= 75 ? 'High Viral Potential 🔥' : s >= 50 ? 'Moderate Potential ⚡' : 'Low Potential — Needs Work'

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Viral Content Predictor</h1>
        <p className="text-[#9494B0] text-sm">Score your content before posting. Know what will go viral.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-6">
        {/* Input */}
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 space-y-4">
          <Textarea label="Your content idea or draft" value={content} onChange={e => setContent(e.target.value)}
            placeholder="Paste your post, caption, tweet, or content idea here..." rows={6} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Primary platform</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    platform === p ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#1A1A24] border-[#2A2A3A] text-[#9494B0]')}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <Button size="xl" onClick={analyze} disabled={loading || !content.trim()}>
            {loading ? '⟳ Analysing...' : <><Flame size={16} /> Predict Viral Score</>}
          </Button>

          {/* Example fills */}
          <div>
            <p className="text-xs text-[#5A5A78] mb-2">Try an example:</p>
            <div className="space-y-2">
              {[
                'I spent $10,000 on ads last year. Here\'s what actually worked (and what was a complete waste):',
                'The secret to 10x engagement? Stop trying to go viral. Do this instead 👇',
                'Hot take: Most marketing advice is wrong. Here\'s what the data actually shows.',
              ].map((ex, i) => (
                <button key={i} onClick={() => setContent(ex)}
                  className="w-full text-left text-xs text-[#9494B0] hover:text-[#F0EFFF] bg-[#1A1A24] border border-[#2A2A3A] rounded-lg px-3 py-2 transition-all hover:border-[#3D3D55]">
                  "{ex.slice(0, 60)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="text-5xl mb-3">🔥</div>
              <h3 className="font-semibold text-[#F0EFFF] mb-2">Paste your content and predict virality</h3>
              <p className="text-sm text-[#9494B0]">Get a score, emotional trigger analysis, and improvement suggestions.</p>
            </div>
          )}

          {loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="flex gap-1.5 justify-center mb-4">
                {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
              <p className="text-[#9494B0]">Analysing emotional triggers and virality signals...</p>
            </div>
          )}

          {result && (
            <>
              {/* Score */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 text-center">
                <div className={cn('font-mono font-bold text-6xl mb-2', scoreColor(result.overallScore))}>{result.overallScore}</div>
                <div className="text-sm font-medium text-[#F0EFFF] mb-1">{scoreLabel(result.overallScore)}</div>
                <div className="text-xs text-[#5A5A78]">Virality score out of 100</div>
              </div>

              {/* Platform scores */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <h3 className="font-semibold text-sm text-[#F0EFFF] mb-4">Platform-Specific Scores</h3>
                <div className="space-y-2">
                  {Object.entries(result.platformScores).map(([p, s]) => (
                    <div key={p} className="flex items-center gap-3">
                      <span className="text-xs text-[#9494B0] w-24 flex-shrink-0">{p}</span>
                      <div className="flex-1 h-2 bg-[#2A2A3A] rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all duration-700', s >= 75 ? 'bg-[#00D97E]' : s >= 50 ? 'bg-[#FFB547]' : 'bg-[#FF6B6B]')}
                          style={{ width: `${s}%` }} />
                      </div>
                      <span className={cn('text-xs font-mono font-bold w-8 text-right', scoreColor(s))}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emotional triggers */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">Emotional Triggers Detected</h3>
                <div className="flex gap-2 flex-wrap">
                  {result.triggers.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full bg-[#6C47FF20] text-[#A78BFA] border border-[#6C47FF40] text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">💡 Improvement Suggestions</h3>
                <div className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A24]">
                      <span className="text-xs text-[#9494B0]">{s.text}</span>
                      <span className="text-xs text-[#00D97E] font-medium ml-3 flex-shrink-0">{s.impact}</span>
                    </div>
                  ))}
                  {result.suggestions.length === 0 && <p className="text-xs text-[#00D97E]">✅ Content is well-optimised for virality!</p>}
                </div>
              </div>

              {/* Best time */}
              <div className="bg-gradient-to-r from-[#6C47FF15] to-[#00C8FF10] border border-[#6C47FF30] rounded-xl p-4 flex items-center gap-3">
                <Clock size={18} className="text-[#A78BFA] flex-shrink-0" />
                <div>
                  <div className="text-xs text-[#5A5A78] mb-0.5">Best posting time for {platform}</div>
                  <div className="text-sm font-medium text-[#F0EFFF]">{result.bestTime}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
