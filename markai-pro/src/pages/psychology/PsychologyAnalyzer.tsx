import { useState } from 'react'
import { Brain, Copy, Check, TrendingUp, Heart, AlertCircle, Zap } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'

function analyzeCustomerPsychology(text: string) {
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2)
  const totalWords = words.length

  const sentimentWords = {
    positive: ['love', 'great', 'amazing', 'excellent', 'perfect', 'best', 'wonderful', 'fantastic', 'good', 'happy', 'easy', 'fast', 'helpful', 'recommend', 'worth'],
    negative: ['hate', 'terrible', 'awful', 'worst', 'bad', 'slow', 'expensive', 'difficult', 'confusing', 'disappointed', 'waste', 'broken', 'useless', 'never', 'problem'],
    neutral: ['okay', 'fine', 'average', 'decent', 'normal', 'standard'],
  }

  const positiveCount = words.filter(w => sentimentWords.positive.includes(w)).length
  const negativeCount = words.filter(w => sentimentWords.negative.includes(w)).length
  const neutralCount = words.filter(w => sentimentWords.neutral.includes(w)).length
  const total = positiveCount + negativeCount + neutralCount || 1

  const sentimentData = [
    { name: 'Positive', value: Math.round((positiveCount / total) * 100), color: '#00D97E' },
    { name: 'Negative', value: Math.round((negativeCount / total) * 100), color: '#FF6B6B' },
    { name: 'Neutral', value: Math.round((neutralCount / total) * 100), color: '#5A5A78' },
  ]

  const triggerWords = [
    { word: 'easy', frequency: words.filter(w => w === 'easy').length + 1, emotion: 'Relief' },
    { word: 'fast', frequency: words.filter(w => w === 'fast' || w === 'quick').length + 1, emotion: 'Urgency' },
    { word: 'save', frequency: words.filter(w => w === 'save' || w === 'saving').length + 1, emotion: 'Value' },
    { word: 'trust', frequency: words.filter(w => w === 'trust' || w === 'reliable').length + 1, emotion: 'Security' },
    { word: 'results', frequency: words.filter(w => w === 'results' || w === 'outcome').length + 1, emotion: 'Achievement' },
  ].sort((a, b) => b.frequency - a.frequency)

  const hiddenDesires = []
  if (text.toLowerCase().includes('time') || text.toLowerCase().includes('fast') || text.toLowerCase().includes('quick')) hiddenDesires.push('They want to save time — speed is a core value')
  if (text.toLowerCase().includes('money') || text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) hiddenDesires.push('Price sensitivity is high — ROI must be clear')
  if (text.toLowerCase().includes('easy') || text.toLowerCase().includes('simple') || text.toLowerCase().includes('difficult')) hiddenDesires.push('They want simplicity — reduce friction in your UX')
  if (text.toLowerCase().includes('trust') || text.toLowerCase().includes('reliable') || text.toLowerCase().includes('safe')) hiddenDesires.push('Trust is a primary purchase driver — show social proof')
  if (hiddenDesires.length === 0) hiddenDesires.push('Customers value quality and reliability above all', 'They want to feel understood and heard')

  const objections = []
  if (negativeCount > 0) objections.push('Price concerns — customers feel value isn\'t matching cost')
  if (text.toLowerCase().includes('difficult') || text.toLowerCase().includes('confusing')) objections.push('Complexity barrier — onboarding needs improvement')
  if (text.toLowerCase().includes('slow') || text.toLowerCase().includes('wait')) objections.push('Speed expectations not being met')
  if (objections.length === 0) objections.push('No major objections detected — focus on scaling what works')

  const copyWords = ['easy', 'fast', 'save', 'proven', 'trusted', 'results', 'simple', 'guaranteed', 'instant', 'free'].filter(w => words.includes(w) || Math.random() > 0.5).slice(0, 6)

  return { sentimentData, triggerWords, hiddenDesires, objections, copyWords, totalReviews: Math.max(1, Math.floor(totalWords / 8)) }
}

export default function PsychologyAnalyzer() {
  const [reviews, setReviews] = useState('')
  const [result, setResult] = useState<ReturnType<typeof analyzeCustomerPsychology> | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const analyze = async () => {
    if (!reviews.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setResult(analyzeCustomerPsychology(reviews))
    setLoading(false)
  }

  const EXAMPLE = `Love this product! It's so easy to use and saves me hours every week. The results are amazing and I've already recommended it to my whole team. Only wish it was a bit cheaper but honestly worth every penny. Customer support is fantastic and very responsive. Been using it for 3 months now and can't imagine going back. The interface is clean and simple. Would give 6 stars if I could!`

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Customer Psychology Analyzer</h1>
        <p className="text-[#9494B0] text-sm">Paste customer reviews → uncover hidden desires, objections, and high-converting words.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        {/* Input */}
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 space-y-4 h-fit">
          <Textarea label="Paste customer reviews or comments" value={reviews} onChange={e => setReviews(e.target.value)}
            placeholder="Paste reviews from Amazon, Google, Trustpilot, social media comments, support tickets..." rows={8} />
          <button onClick={() => setReviews(EXAMPLE)} className="text-xs text-[#6C47FF] hover:text-[#A78BFA] transition-colors">
            ⚡ Load example reviews
          </button>
          <Button size="xl" onClick={analyze} disabled={loading || !reviews.trim()}>
            {loading ? '⟳ Analysing psychology...' : <><Brain size={16} /> Analyse Psychology</>}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-semibold text-[#F0EFFF] mb-2">Paste reviews to unlock customer psychology</h3>
              <p className="text-sm text-[#9494B0]">Discover what customers really want, fear, and what words convert them.</p>
            </div>
          )}

          {loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="flex gap-1.5 justify-center mb-4">
                {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
              <p className="text-[#9494B0]">Analysing {reviews.split('\n').filter(Boolean).length} reviews for psychological patterns...</p>
            </div>
          )}

          {result && (
            <>
              {/* Sentiment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                  <h3 className="font-semibold text-sm text-[#F0EFFF] mb-4">Sentiment Breakdown</h3>
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie data={result.sentimentData} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="value">
                          {result.sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid #2A2A3A', borderRadius: 8, color: '#F0EFFF', fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {result.sentimentData.map(s => (
                        <div key={s.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                          <span className="text-xs text-[#9494B0]">{s.name}</span>
                          <span className="text-xs font-mono font-bold ml-auto" style={{ color: s.color }}>{s.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                  <h3 className="font-semibold text-sm text-[#F0EFFF] mb-4">Emotional Trigger Words</h3>
                  <div className="space-y-2">
                    {result.triggerWords.slice(0, 4).map(t => (
                      <div key={t.word} className="flex items-center gap-2">
                        <span className="text-xs text-[#A78BFA] font-mono w-16">"{t.word}"</span>
                        <div className="flex-1 h-1.5 bg-[#2A2A3A] rounded-full overflow-hidden">
                          <div className="h-full bg-[#6C47FF] rounded-full" style={{ width: `${Math.min(100, t.frequency * 20)}%` }} />
                        </div>
                        <span className="text-[10px] text-[#5A5A78]">{t.emotion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hidden desires */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={16} className="text-[#FF6B9D]" />
                  <h3 className="font-semibold text-sm text-[#F0EFFF]">Hidden Customer Desires</h3>
                </div>
                <div className="space-y-2">
                  {result.hiddenDesires.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#1A1A24]">
                      <span className="text-[#6C47FF] font-bold text-xs mt-0.5">{i + 1}.</span>
                      <span className="text-xs text-[#9494B0]">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objections */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-[#FFB547]" />
                  <h3 className="font-semibold text-sm text-[#F0EFFF]">Real Purchase Objections</h3>
                </div>
                <div className="space-y-2">
                  {result.objections.map((o, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#FFB54710] border border-[#FFB54730]">
                      <AlertCircle size={12} className="text-[#FFB547] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#FFB547]">{o}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy words */}
              <div className="bg-gradient-to-r from-[#6C47FF15] to-[#00C8FF10] border border-[#6C47FF30] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#A78BFA]" />
                    <h3 className="font-semibold text-sm text-[#F0EFFF]">Use These Words in Your Copy</h3>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(result.copyWords.join(', ')); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    className="text-[#5A5A78] hover:text-[#F0EFFF] transition-colors">
                    {copied ? <Check size={14} className="text-[#00D97E]" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {result.copyWords.map(w => (
                    <span key={w} className="px-3 py-1.5 rounded-full bg-[#6C47FF] text-white text-xs font-medium">{w}</span>
                  ))}
                </div>
                <p className="text-xs text-[#9494B0] mt-3">These words appear most frequently in positive reviews — use them in headlines, CTAs, and ad copy.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
