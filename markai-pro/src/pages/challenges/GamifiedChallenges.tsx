import { useState } from 'react'
import { Trophy, Upload, ThumbsUp, Star, Flame, Plus, Clock, Award } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const CHALLENGES = [
  { id: '1', title: 'Write a viral LinkedIn post about AI marketing', category: 'Content', difficulty: 'Beginner', reward: '50 credits + Badge', deadline: '3 days left', submissions: 47, description: 'Create a LinkedIn post about AI marketing that gets real engagement. Must include a hook, insight, and CTA. Submit screenshot of post with engagement stats.', icon: '✍️' },
  { id: '2', title: 'Build a complete email sequence for a SaaS product', category: 'Email Marketing', difficulty: 'Pro', reward: '150 credits + Pro Badge', deadline: '5 days left', submissions: 23, description: 'Create a 5-email welcome sequence for a SaaS product. Include subject lines, preview text, and full body copy. Must follow best practices for each email type.', icon: '📧' },
  { id: '3', title: 'Reverse-engineer a competitor\'s ad strategy', category: 'Strategy', difficulty: 'Expert', reward: '300 credits + Expert Badge', deadline: '7 days left', submissions: 12, description: 'Pick any competitor in your niche. Analyse their ads, identify their strategy, and create a counter-campaign brief. Submit your full analysis.', icon: '🕵️' },
  { id: '4', title: 'Create a 30-day content calendar from scratch', category: 'Content Planning', difficulty: 'Pro', reward: '200 credits + Planner Badge', deadline: '10 days left', submissions: 31, description: 'Build a complete 30-day content calendar for a brand of your choice. Include platform, content type, topic, and posting time for each day.', icon: '📅' },
]

const LEADERBOARD = [
  { rank: 1, name: 'Sarah M.', points: 2840, badge: '🏆', challenges: 24 },
  { rank: 2, name: 'James T.', points: 2210, badge: '🥈', challenges: 19 },
  { rank: 3, name: 'Priya K.', points: 1890, badge: '🥉', challenges: 16 },
  { rank: 4, name: 'Marcus L.', points: 1540, badge: '⭐', challenges: 13 },
  { rank: 5, name: 'Aisha P.', points: 1280, badge: '⭐', challenges: 11 },
]

const SUBMISSIONS = [
  { id: '1', challenge: 'Write a viral LinkedIn post', author: 'David K.', avatar: '👨💻', votes: 34, preview: 'I spent 6 months testing every AI marketing tool. Here\'s what actually worked...', time: '2 hours ago' },
  { id: '2', challenge: 'Build a complete email sequence', author: 'Lisa P.', avatar: '👩💼', votes: 28, preview: 'Subject: Welcome to [Product] — your journey starts now...', time: '4 hours ago' },
  { id: '3', challenge: 'Write a viral LinkedIn post', author: 'Tom R.', avatar: '🧑🏫', votes: 19, preview: 'Hot take: Most marketing advice is completely wrong. Here\'s the data...', time: '6 hours ago' },
]

const difficultyColor: Record<string, string> = {
  Beginner: 'text-[#00D97E] bg-[#00D97E15] border-[#00D97E30]',
  Pro: 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]',
  Expert: 'text-[#FF6B6B] bg-[#FF6B6B15] border-[#FF6B6B30]',
}

export default function GamifiedChallenges() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'submissions' | 'leaderboard'>('challenges')
  const [selected, setSelected] = useState<typeof CHALLENGES[0] | null>(null)
  const [votes, setVotes] = useState<Record<string, boolean>>({})

  const toggleVote = (id: string) => setVotes(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Marketing Challenges</h1>
          <p className="text-[#9494B0] text-sm">Weekly AI-generated challenges. Earn credits, badges, and recognition.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#FFB54715] border border-[#FFB54730] rounded-xl">
          <Flame size={16} className="text-[#FFB547]" />
          <span className="text-sm text-[#FFB547] font-medium">Your streak: 7 days</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#111118] border border-[#2A2A3A] rounded-xl p-1 w-fit">
        {[{ id: 'challenges', label: '🎯 Active Challenges' }, { id: 'submissions', label: '📤 Submissions' }, { id: 'leaderboard', label: '🏆 Leaderboard' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              activeTab === t.id ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            {CHALLENGES.map(challenge => (
              <div key={challenge.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 card-glow transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A24] flex items-center justify-center text-2xl flex-shrink-0">{challenge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', difficultyColor[challenge.difficulty])}>{challenge.difficulty}</span>
                      <span className="text-[10px] text-[#9494B0] bg-[#1A1A24] border border-[#2A2A3A] px-2 py-0.5 rounded-full">{challenge.category}</span>
                      <span className="flex items-center gap-1 text-[10px] text-[#FF6B6B] ml-auto"><Clock size={10} />{challenge.deadline}</span>
                    </div>
                    <h3 className="font-semibold text-[#F0EFFF] mb-1">{challenge.title}</h3>
                    <p className="text-xs text-[#9494B0] mb-3 leading-relaxed">{challenge.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[#5A5A78]">
                        <span className="flex items-center gap-1"><Award size={11} className="text-[#FFB547]" />{challenge.reward}</span>
                        <span>{challenge.submissions} submissions</span>
                      </div>
                      <Button size="sm" onClick={() => setSelected(challenge)}>
                        <Upload size={12} /> Submit Entry
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">🎖️ Your Badges</h3>
              <div className="grid grid-cols-4 gap-2">
                {['🌱', '⭐', '🎯', '🔥', '💡', '🏆', '🥇', '✨'].map((badge, i) => (
                  <div key={i} className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl', i < 4 ? 'bg-[#6C47FF20] border border-[#6C47FF40]' : 'bg-[#1A1A24] border border-[#2A2A3A] opacity-40')}>
                    {badge}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#5A5A78] mt-2">4/8 badges earned</p>
            </div>

            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
              <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">⚡ Your Stats</h3>
              <div className="space-y-2">
                {[{ label: 'Challenges completed', value: '7' }, { label: 'Total credits earned', value: '840' }, { label: 'Community rank', value: '#24' }, { label: 'Votes received', value: '156' }].map(s => (
                  <div key={s.label} className="flex items-center justify-between p-2 rounded-lg bg-[#1A1A24]">
                    <span className="text-xs text-[#5A5A78]">{s.label}</span>
                    <span className="text-xs font-mono font-bold text-[#A78BFA]">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {SUBMISSIONS.map(sub => (
            <div key={sub.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A1A24] flex items-center justify-center text-xl flex-shrink-0">{sub.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-medium text-sm text-[#F0EFFF]">{sub.author}</span>
                      <span className="text-xs text-[#5A5A78] ml-2">{sub.time}</span>
                    </div>
                    <button onClick={() => toggleVote(sub.id)}
                      className={cn('flex items-center gap-1.5 text-sm transition-colors', votes[sub.id] ? 'text-[#6C47FF]' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
                      <ThumbsUp size={14} /> {sub.votes + (votes[sub.id] ? 1 : 0)}
                    </button>
                  </div>
                  <p className="text-xs text-[#5A5A78] mb-2">Challenge: {sub.challenge}</p>
                  <div className="bg-[#0D0D14] border border-[#2A2A3A] rounded-lg p-3 text-sm text-[#9494B0] italic">"{sub.preview}"</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="max-w-2xl">
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[#2A2A3A] flex items-center gap-2">
              <Trophy size={16} className="text-[#FFB547]" />
              <h3 className="font-semibold text-[#F0EFFF]">Weekly Leaderboard</h3>
            </div>
            {LEADERBOARD.map(entry => (
              <div key={entry.rank} className={cn('flex items-center gap-4 px-5 py-4 border-b border-[#2A2A3A] last:border-0', entry.rank <= 3 && 'bg-[#6C47FF05]')}>
                <span className="text-2xl w-8 text-center">{entry.badge}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm text-[#F0EFFF]">{entry.name}</div>
                  <div className="text-xs text-[#5A5A78]">{entry.challenges} challenges completed</div>
                </div>
                <div className="font-mono font-bold text-[#A78BFA]">{entry.points.toLocaleString()} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#F0EFFF]">Submit Entry</h3>
              <button onClick={() => setSelected(null)} className="text-[#5A5A78] hover:text-[#F0EFFF] text-xl">×</button>
            </div>
            <p className="text-sm text-[#9494B0] mb-4">{selected.title}</p>
            <textarea placeholder="Paste your submission here, or describe what you created..." rows={5}
              className="w-full px-3 py-2.5 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] placeholder-[#5A5A78] text-sm resize-none focus:outline-none focus:border-[#6C47FF] transition-all mb-3" />
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setSelected(null)}>Cancel</Button>
              <Button className="flex-1" onClick={() => setSelected(null)}>Submit Entry</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
