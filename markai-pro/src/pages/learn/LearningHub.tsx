import { useState } from 'react'
import { Search, Play, BookOpen, Star, Clock, ChevronRight, CheckCircle, Lock, Trophy, Flame } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

const CATEGORIES = ['All', 'SEO', 'Google Ads', 'Meta Ads', 'Content Marketing', 'Email Marketing', 'Analytics', 'AI Marketing', 'Freelancing']

const COURSES = [
  { id: '1', title: 'SEO Mastery: From Zero to Page 1', category: 'SEO', lessons: 24, duration: '8h 30m', level: 'Beginner', instructor: 'Sarah Chen', rating: 4.9, enrolled: 2840, thumbnail: '🔍', free: true },
  { id: '2', title: 'Google Ads Complete Bootcamp 2025', category: 'Google Ads', lessons: 32, duration: '12h 15m', level: 'Intermediate', instructor: 'Marcus Lee', rating: 4.8, enrolled: 1920, thumbnail: '🎯', free: false },
  { id: '3', title: 'Meta Ads Mastery: ROAS-Focused Strategy', category: 'Meta Ads', lessons: 18, duration: '6h 45m', level: 'Intermediate', instructor: 'Priya Sharma', rating: 4.7, enrolled: 1540, thumbnail: '📣', free: false },
  { id: '4', title: 'Content Marketing That Converts', category: 'Content Marketing', lessons: 20, duration: '7h 20m', level: 'Beginner', instructor: 'James Wright', rating: 4.8, enrolled: 3210, thumbnail: '✍️', free: true },
  { id: '5', title: 'Email Marketing Automation Masterclass', category: 'Email Marketing', lessons: 15, duration: '5h 10m', level: 'Intermediate', instructor: 'Aisha Patel', rating: 4.9, enrolled: 1870, thumbnail: '📧', free: false },
  { id: '6', title: 'GA4 & Analytics for Marketers', category: 'Analytics', lessons: 22, duration: '9h 00m', level: 'Advanced', instructor: 'Tom Rivera', rating: 4.6, enrolled: 1120, thumbnail: '📊', free: false },
  { id: '7', title: 'AI Marketing Tools: The Complete Guide', category: 'AI Marketing', lessons: 28, duration: '10h 30m', level: 'Beginner', instructor: 'Lisa Park', rating: 4.9, enrolled: 4200, thumbnail: '🤖', free: false },
  { id: '8', title: 'Freelance Marketing: Land Your First Client', category: 'Freelancing', lessons: 16, duration: '5h 45m', level: 'Beginner', instructor: 'David Kim', rating: 4.8, enrolled: 2650, thumbnail: '💼', free: true },
]

const LEARNING_PATHS = [
  { title: 'Digital Marketing Fundamentals', courses: 4, duration: '28h', level: 'Beginner', icon: '🌱' },
  { title: 'Paid Advertising Pro', courses: 3, duration: '25h', level: 'Intermediate', icon: '🚀' },
  { title: 'SEO & Content Expert', courses: 3, duration: '22h', level: 'Advanced', icon: '🏆' },
]

const levelColor: Record<string, string> = {
  Beginner: 'text-[#00D97E] bg-[#00D97E15] border-[#00D97E30]',
  Intermediate: 'text-[#FFB547] bg-[#FFB54715] border-[#FFB54730]',
  Advanced: 'text-[#FF6B6B] bg-[#FF6B6B15] border-[#FF6B6B30]',
}

function CourseCard({ course, onClick }: { course: typeof COURSES[0]; onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden card-glow transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
      <div className="h-32 bg-gradient-to-br from-[#6C47FF20] to-[#00C8FF10] flex items-center justify-center text-5xl relative">
        {course.thumbnail}
        {course.free && (
          <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-[#00D97E] text-white font-medium">FREE</span>
        )}
        {!course.free && (
          <span className="absolute top-2 right-2"><Lock size={14} className="text-[#5A5A78]" /></span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', levelColor[course.level])}>{course.level}</span>
          <span className="text-[10px] text-[#5A5A78] bg-[#1A1A24] border border-[#2A2A3A] px-2 py-0.5 rounded-full">{course.category}</span>
        </div>
        <h3 className="font-semibold text-sm text-[#F0EFFF] mb-1 leading-snug">{course.title}</h3>
        <p className="text-xs text-[#9494B0] mb-3">{course.instructor}</p>
        <div className="flex items-center justify-between text-xs text-[#5A5A78]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><BookOpen size={11} />{course.lessons} lessons</span>
            <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-[#FFB547]">
            <Star size={11} className="fill-[#FFB547]" />
            <span>{course.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseDetail({ course, onBack }: { course: typeof COURSES[0]; onBack: () => void }) {
  const [activeLesson, setActiveLesson] = useState(0)
  const [completed, setCompleted] = useState<number[]>([0])

  const lessons = Array.from({ length: Math.min(course.lessons, 8) }, (_, i) => ({
    id: i,
    title: `Lesson ${i + 1}: ${['Introduction & Overview', 'Core Concepts', 'Strategy Framework', 'Practical Implementation', 'Advanced Techniques', 'Case Studies', 'Common Mistakes', 'Final Project'][i] || `Module ${i + 1}`}`,
    duration: `${8 + i * 3}m`,
    free: i < 2,
  }))

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#9494B0] hover:text-[#F0EFFF] mb-6 transition-colors">
        ← Back to courses
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          {/* Video player */}
          <div className="bg-[#0D0D14] border border-[#2A2A3A] rounded-xl aspect-video flex items-center justify-center mb-5 relative overflow-hidden">
            <div className="text-6xl mb-2">{course.thumbnail}</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-[#6C47FF] flex items-center justify-center hover:bg-[#4A2FD4] transition-colors">
                <Play size={24} className="text-white ml-1" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-[#2A2A3A] rounded-full overflow-hidden">
                <div className="h-full bg-[#6C47FF] w-1/3 rounded-full" />
              </div>
              <span className="text-xs text-[#9494B0]">4:32 / 12:45</span>
            </div>
          </div>

          <h1 className="font-display font-bold text-2xl mb-2">{course.title}</h1>
          <div className="flex items-center gap-4 mb-4 text-sm text-[#9494B0]">
            <span>{course.instructor}</span>
            <span className="flex items-center gap-1"><Star size={13} className="fill-[#FFB547] text-[#FFB547]" />{course.rating}</span>
            <span>{course.enrolled.toLocaleString()} enrolled</span>
          </div>

          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
            <h3 className="font-semibold text-[#F0EFFF] mb-3">About this course</h3>
            <p className="text-sm text-[#9494B0] leading-relaxed">
              Master {course.category} with this comprehensive course designed for {course.level.toLowerCase()} marketers.
              You'll learn proven strategies, real-world techniques, and get hands-on practice with actual campaigns.
            </p>
          </div>
        </div>

        {/* Curriculum */}
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#2A2A3A]">
            <h3 className="font-semibold text-[#F0EFFF]">Course Curriculum</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-[#5A5A78]">
              <span>{course.lessons} lessons</span>
              <span>{course.duration}</span>
              <span className="ml-auto text-[#00D97E]">{completed.length}/{lessons.length} done</span>
            </div>
            <div className="h-1.5 bg-[#2A2A3A] rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#6C47FF] rounded-full transition-all" style={{ width: `${(completed.length / lessons.length) * 100}%` }} />
            </div>
          </div>
          <div className="overflow-y-auto max-h-96 scrollbar-hide">
            {lessons.map(lesson => (
              <div key={lesson.id}
                onClick={() => { if (lesson.free || !course.free) { setActiveLesson(lesson.id); setCompleted(p => p.includes(lesson.id) ? p : [...p, lesson.id]) } }}
                className={cn('flex items-center gap-3 px-4 py-3 border-b border-[#2A2A3A] last:border-0 transition-colors',
                  activeLesson === lesson.id ? 'bg-[#6C47FF15]' : 'hover:bg-[#1A1A24]',
                  (lesson.free || !course.free) ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                )}>
                <div className="flex-shrink-0">
                  {completed.includes(lesson.id)
                    ? <CheckCircle size={16} className="text-[#00D97E]" />
                    : lesson.free || !course.free
                      ? <Play size={16} className="text-[#9494B0]" />
                      : <Lock size={16} className="text-[#5A5A78]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#F0EFFF] truncate">{lesson.title}</div>
                  <div className="text-xs text-[#5A5A78]">{lesson.duration}</div>
                </div>
                {lesson.free && <span className="text-[10px] text-[#00D97E] bg-[#00D97E15] border border-[#00D97E30] px-1.5 py-0.5 rounded-full">Free</span>}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[#2A2A3A]">
            <Button size="lg" className="w-full">{course.free ? 'Continue Learning' : 'Enroll Now'}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LearningHub() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null)
  const [streak] = useState(7)

  const filtered = COURSES.filter(c =>
    (category === 'All' || c.category === category) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase()))
  )

  if (selectedCourse) return (
    <div className="max-w-7xl mx-auto">
      <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Learning Hub</h1>
          <p className="text-[#9494B0] text-sm">Master digital marketing with expert-led courses.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#FFB54715] border border-[#FFB54730] rounded-xl">
          <Flame size={16} className="text-[#FFB547]" />
          <span className="text-sm font-medium text-[#FFB547]">{streak} day streak</span>
        </div>
      </div>

      {/* Learning paths */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {LEARNING_PATHS.map(path => (
          <div key={path.title} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4 card-glow cursor-pointer hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-2xl mb-2">{path.icon}</div>
            <h3 className="font-semibold text-sm text-[#F0EFFF] mb-1">{path.title}</h3>
            <div className="flex items-center gap-3 text-xs text-[#5A5A78]">
              <span>{path.courses} courses</span>
              <span>{path.duration}</span>
              <span className={cn('px-2 py-0.5 rounded-full border', levelColor[path.level])}>{path.level}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A78]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..."
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-sm text-[#F0EFFF] placeholder-[#5A5A78] focus:outline-none focus:border-[#6C47FF] transition-all" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              category === cat ? 'bg-[#6C47FF] border-[#6C47FF] text-white' : 'bg-[#111118] border-[#2A2A3A] text-[#9494B0]'
            )}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(course => (
          <CourseCard key={course.id} course={course} onClick={() => setSelectedCourse(course)} />
        ))}
      </div>
    </div>
  )
}
