import { useState, useEffect } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'
import { sleep } from '../../lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const chartData = [
  { name: 'Mon', impressions: 4200, clicks: 320, conversions: 28 },
  { name: 'Tue', impressions: 5800, clicks: 410, conversions: 35 },
  { name: 'Wed', impressions: 3900, clicks: 280, conversions: 22 },
  { name: 'Thu', impressions: 7200, clicks: 580, conversions: 51 },
  { name: 'Fri', impressions: 6100, clicks: 490, conversions: 44 },
  { name: 'Sat', impressions: 4800, clicks: 360, conversions: 31 },
  { name: 'Sun', impressions: 3200, clicks: 240, conversions: 19 },
]

const highlights = [
  { metric: 'Total Impressions', value: '35,200', change: '+18%', context: 'Above industry average for this period', recommendation: 'Increase LinkedIn posting frequency to capitalise on momentum' },
  { metric: 'Click-through Rate', value: '6.2%', change: '+0.8%', context: 'Strong performance — benchmark is 3-5%', recommendation: 'A/B test current headlines to push CTR above 7%' },
  { metric: 'Conversions', value: '230', change: '+24%', context: 'Best week in Q3 so far', recommendation: 'Replicate Thursday campaign structure — highest single-day performance' },
]

const SAMPLE_NARRATIVE = `## Campaign Performance Summary — Week of July 7–13, 2025

This was a strong week for your digital marketing efforts. Total impressions reached **35,200**, representing an 18% increase over the previous period and placing you well above the industry benchmark.

### What Worked

Thursday was your standout day, generating 7,200 impressions and 51 conversions — your highest single-day performance this quarter. The LinkedIn article published that morning drove 62% of the day's traffic, suggesting your audience responds strongly to long-form thought leadership content.

### Areas for Improvement

Wednesday underperformed relative to the rest of the week. Analysis suggests this correlates with the absence of any scheduled content that day. Maintaining consistent daily publishing — even lightweight posts — would likely smooth out these dips.

### Recommendations for Next Week

1. Replicate Thursday's content format (long-form LinkedIn + supporting Instagram carousel)
2. Schedule content for Wednesday to fill the gap
3. Test a new CTA variant on your top-performing ad — current CTR of 6.2% has room to grow`

export default function AnalyticsNarrator() {
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [displayed, setDisplayed] = useState('')

  const generate = async () => {
    setLoading(true)
    setOutput('')
    setDisplayed('')
    await sleep(2000)
    setLoading(false)
    setOutput(SAMPLE_NARRATIVE)
  }

  useEffect(() => {
    if (!output) return
    let i = 0
    const t = setInterval(() => {
      i += 6
      setDisplayed(output.slice(0, i))
      if (i >= output.length) clearInterval(t)
    }, 10)
    return () => clearInterval(t)
  }, [output])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📊</span>
          <h1 className="font-display font-bold text-3xl">Analytics Narrator</h1>
          <span className="px-2 py-0.5 rounded-full bg-[#FFB54720] text-[#FFB547] border border-[#FFB54740] text-xs font-medium">Money Feature</span>
        </div>
        <p className="text-[#9494B0]">Paste raw analytics data → get a beautiful, human-readable report.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 space-y-4">
            <Textarea
              label="Paste your analytics data"
              placeholder="Paste raw numbers from GA4, Meta Ads, Google Ads, or any analytics platform..."
              rows={8}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#9494B0]">Report type</label>
              <select className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
                {['Executive Summary', 'Campaign Report', 'Channel Performance', 'Monthly Review'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="pt-2 border-t border-[#2A2A3A]">
              <p className="text-xs text-[#5A5A78] mb-3">Or connect your accounts:</p>
              <div className="flex gap-2 flex-wrap">
                {['GA4', 'Meta Ads', 'Google Ads'].map(p => (
                  <button key={p} className="px-3 py-1.5 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-xs text-[#9494B0] hover:border-[#6C47FF40] hover:text-[#F0EFFF] transition-all">
                    Connect {p}
                  </button>
                ))}
              </div>
            </div>
            <Button size="xl" onClick={generate} disabled={loading}>
              {loading ? <><span className="animate-spin">⟳</span> Generating report...</> : '✨ Generate Report'}
            </Button>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {!output && !loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="font-semibold text-[#F0EFFF] mb-2">Your report will appear here</h3>
              <p className="text-sm text-[#9494B0]">Paste your data and click Generate.</p>
            </div>
          )}

          {loading && (
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-12 text-center">
              <div className="flex gap-1.5 justify-center mb-4">
                {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#6C47FF] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
              <p className="text-[#9494B0] text-sm">Analysing your data and writing your report...</p>
            </div>
          )}

          {output && (
            <>
              {/* Charts */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <h3 className="font-semibold text-sm text-[#F0EFFF] mb-4">Weekly Performance</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fill: '#5A5A78', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5A5A78', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1A1A24', border: '1px solid #2A2A3A', borderRadius: 8, color: '#F0EFFF' }} />
                    <Bar dataKey="impressions" fill="#6C47FF" radius={[4,4,0,0]} />
                    <Bar dataKey="clicks" fill="#00C8FF" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 gap-3">
                {highlights.map(h => (
                  <div key={h.metric} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#F0EFFF]">{h.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#6C47FF]">{h.value}</span>
                        <span className="text-xs text-[#00D97E]">{h.change}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#9494B0] mb-1">{h.context}</p>
                    <p className="text-xs text-[#6C47FF]">→ {h.recommendation}</p>
                  </div>
                ))}
              </div>

              {/* Narrative */}
              <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#F0EFFF]">Narrative Report</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Download size={14} /> PDF</Button>
                    <Button variant="ghost" size="sm"><FileText size={14} /> .docx</Button>
                  </div>
                </div>
                <div className="text-sm text-[#9494B0] leading-relaxed whitespace-pre-wrap font-mono text-xs">
                  {displayed}
                  {displayed.length < output.length && (
                    <span className="inline-block w-0.5 h-4 bg-[#6C47FF] animate-pulse ml-0.5 align-middle" />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
