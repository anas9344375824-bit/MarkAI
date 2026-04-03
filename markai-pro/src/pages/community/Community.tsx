import { useState } from 'react'
import { Search, ThumbsUp, MessageCircle, Plus, ChevronUp, Award, TrendingUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'

const CATEGORIES = ['All', 'SEO Talk', 'Ads & PPC', 'Content Strategy', 'Freelancing', 'Tools & AI', 'Success Stories', 'Ask the Community']

const POSTS = [
  { id: '1', category: 'SEO Talk', title: 'How I went from 0 to 50k organic visitors in 6 months — full breakdown', author: 'Sarah M.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', likes: 284, replies: 47, time: '2 hours ago', pinned: true, body: 'I want to share my complete SEO journey because I wish someone had shared this with me when I started...' },
  { id: '2', category: 'Ads & PPC', title: 'Meta Ads ROAS dropped 40% after iOS update — what worked for me', author: 'James T.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', likes: 156, replies: 32, time: '4 hours ago', pinned: false, body: 'After the iOS privacy changes, my ROAS tanked. Here\'s the exact strategy I used to recover...' },
  { id: '3', category: 'Tools & AI', title: 'I tested 12 AI writing tools for 30 days — honest comparison', author: 'Priya K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', likes: 312, replies: 68, time: '6 hours ago', pinned: false, body: 'Spent a full month testing every major AI writing tool. Here are my unfiltered results...' },
  { id: '4', category: 'Freelancing', title: 'How I charge $150/hr as a freelance SEO consultant (and get it)', author: 'Marcus L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', likes: 198, replies: 41, time: '1 day ago', pinned: false, body: 'Three years ago I was charging $25/hr. Here\'s exactly how I 6x\'d my rates...' },
  { id: '5', category: 'Content Strategy', title: 'The content calendar system that helped me publish 3x more consistently', author: 'Aisha P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha', likes: 143, replies: 29, time: '1 day ago', pinned: false, body: 'Consistency was my biggest struggle until I built this system...' },
  { id: '6', category: 'Ask the Community', title: 'Best way to track ROI from content marketing? GA4 is confusing me', author: 'Tom R.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', likes: 45, replies: 23, time: '2 days ago', pinned: false, body: 'I\'ve been trying to set up proper content ROI tracking in GA4 but the attribution is all over the place...' },
]

const TOP_CONTRIBUTORS = [
  { name: 'Sarah M.', points: 2840, badge: '🏆', posts: 124 },
  { name: 'James T.', points: 1920, badge: '⭐', posts: 89 },
  { name: 'Priya K.', points: 1540, badge: '🎯', posts: 67 },
  { name: 'Marcus L.', points: 1280, badge: '💡', posts: 54 },
]

const categoryColor: Record<string, string> = {
  'SEO Talk': 'text-[#00D97E] bg-[#00D97E15] border-[#00D97E30]',
  'Ads & PPC': 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]',
  'Content Strategy': 'text-[#00C8FF] bg-[#00C8FF15] border-[#00C8FF30]',
  'Freelancing': 'text-[#A78BFA] bg-[#6C47FF15] border-[#6C47FF30]',
  'Tools & AI': 'text-[#FF6B9D] bg-[#FF6B9D15] border-[#FF6B9D30]',
  'Success Stories': 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]',
  'Ask the Community': 'text-[#9494B0] bg-[#1A1A24] border-[#2A2A3A]',
}

function PostDetail({ post, onBack }: { post: typeof POSTS[0]; onBack: () => void }) {
  const [reply, setReply] = useState('')
  const [liked, setLiked] = useState(false)
  const [replies] = useState([
    { id: '1', author: 'David K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', body: 'This is exactly what I needed. The part about keyword clustering really clicked for me.', likes: 12, time: '1 hour ago' },
    { id: '2', author: 'Lisa P.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', body: 'Great breakdown! Did you use any specific tools for the technical SEO audit?', likes: 8, time: '2 hours ago' },
  ])

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#9494B0] hover:text-[#F0EFFF] mb-6 transition-colors">← Back to community</button>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img src={post.avatar} className="w-10 h-10 rounded-full bg-[#2A2A3A]" />
              <div>
                <div className="font-medium text-sm text-[#F0EFFF]">{post.author}</div>
                <div className="text-xs text-[#5A5A78]">{post.time}</div>
              </div>
              <span className={cn('ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full border', categoryColor[post.category] || 'text-[#9494B0] bg-[#1A1A24] border-[#2A2A3A]')}>{post.category}</span>
            </div>
            <h1 className="font-display font-bold text-xl mb-4">{post.title}</h1>
            <p className="text-sm text-[#9494B0] leading-relaxed mb-6">{post.body} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setLiked(!liked)} className={cn('flex items-center gap-1.5 text-sm transition-colors', liked ? 'text-[#6C47FF]' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
                <ThumbsUp size={15} /> {post.likes + (liked ? 1 : 0)}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-[#9494B0]"><MessageCircle size={15} /> {post.replies}</span>
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-3 mb-4">
            {replies.map(r => (
              <div key={r.id} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img src={r.avatar} className="w-7 h-7 rounded-full bg-[#2A2A3A]" />
                  <span className="text-sm font-medium text-[#F0EFFF]">{r.author}</span>
                  <span className="text-xs text-[#5A5A78] ml-auto">{r.time}</span>
                </div>
                <p className="text-sm text-[#9494B0]">{r.body}</p>
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <Textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a reply..." rows={3} />
            <div className="flex justify-end mt-3">
              <Button size="sm" disabled={!reply.trim()}>Post reply</Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <h3 className="font-semibold text-sm text-[#F0EFFF] mb-3">About the author</h3>
            <div className="flex items-center gap-3">
              <img src={post.avatar} className="w-10 h-10 rounded-full bg-[#2A2A3A]" />
              <div>
                <div className="font-medium text-sm text-[#F0EFFF]">{post.author}</div>
                <div className="text-xs text-[#5A5A78]">Marketing Expert · 2,840 pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Community() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedPost, setSelectedPost] = useState<typeof POSTS[0] | null>(null)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')

  const filtered = POSTS.filter(p =>
    (category === 'All' || p.category === category) &&
    (p.title.toLowerCase().includes(search.toLowerCase()))
  )

  if (selectedPost) return (
    <div className="max-w-7xl mx-auto">
      <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Community</h1>
          <p className="text-[#9494B0] text-sm">Connect, share, and learn with 2,400+ marketers.</p>
        </div>
        <Button onClick={() => setShowNewPost(!showNewPost)}>
          <Plus size={16} /> New Post
        </Button>
      </div>

      {showNewPost && (
        <div className="bg-[#111118] border border-[#6C47FF30] rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-[#F0EFFF] mb-4">Create a new post</h3>
          <div className="space-y-3">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Post title..."
              className="w-full h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] placeholder-[#5A5A78] text-sm focus:outline-none focus:border-[#6C47FF] transition-all" />
            <Textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Share your knowledge, question, or story..." rows={4} />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowNewPost(false)}>Cancel</Button>
              <Button size="sm" disabled={!newTitle.trim() || !newBody.trim()}>Publish post</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div>
          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search discussions..."
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all" />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  category === cat ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0]'
                )}>{cat}</button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {filtered.map(post => (
              <div key={post.id} onClick={() => setSelectedPost(post)}
                className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4 card-glow cursor-pointer transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-start gap-3">
                  <img src={post.avatar} className="w-9 h-9 rounded-full bg-[#2A2A3A] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', categoryColor[post.category] || 'text-[#9494B0] bg-[#1A1A24] border-[#2A2A3A]')}>{post.category}</span>
                      {post.pinned && <span className="text-[10px] text-[#FFB547] bg-[#FFB54715] border border-[#FFB54730] px-2 py-0.5 rounded-full">📌 Pinned</span>}
                    </div>
                    <h3 className="font-semibold text-sm text-[#F0EFFF] mb-1 leading-snug">{post.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#5A5A78]">
                      <span>{post.author}</span>
                      <span>{post.time}</span>
                      <span className="flex items-center gap-1 ml-auto"><ThumbsUp size={11} />{post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={11} />{post.replies}</span>
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
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-[#FFB547]" />
              <h3 className="font-semibold text-sm text-[#F0EFFF]">Top Contributors</h3>
            </div>
            <div className="space-y-3">
              {TOP_CONTRIBUTORS.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#5A5A78] w-4">{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-[#1A1A24] flex items-center justify-center text-sm">{c.badge}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#F0EFFF] truncate">{c.name}</div>
                    <div className="text-xs text-[#5A5A78]">{c.points.toLocaleString()} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-[#6C47FF]" />
              <h3 className="font-semibold text-sm text-[#F0EFFF]">Trending Posts</h3>
            </div>
            <div className="space-y-2">
              {POSTS.slice(0, 4).map(p => (
                <div key={p.id} onClick={() => setSelectedPost(p)} className="text-xs text-[#9494B0] hover:text-[#F0EFFF] cursor-pointer transition-colors leading-snug">
                  {p.title.slice(0, 55)}...
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
