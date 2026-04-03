import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAppStore } from '../store/appStore'

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function SignUp() {
  const navigate = useNavigate()
  const { login } = useAppStore()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters'
    if (!validateEmail(form.email)) e.email = 'Enter a valid email address'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate API call — replace with real fetch to /api/auth/register
    await new Promise(r => setTimeout(r, 800))
    login(form.email, form.name, 'free')
    setLoading(false)
    navigate('/onboarding')
  }

  return (
    <div className="min-h-screen bg-[#08080C] flex">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#6C47FF] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg">
              <span className="text-[#6C47FF]">Mark</span>AI Pro
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl mb-2">Create your account</h1>
          <p className="text-[#9494B0] text-sm mb-8">Start your free trial — no credit card needed.</p>

          <Button variant="ghost" size="lg" className="w-full mb-4 justify-center" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#2A2A3A]" />
            <span className="text-xs text-[#5A5A78]">or</span>
            <div className="flex-1 h-px bg-[#2A2A3A]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <Input label="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Alex Carter" error={errors.name} />
            <Input label="Email address" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@company.com" error={errors.email} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-[#9494B0]">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  className={`w-full h-10 px-3 pr-10 rounded-lg bg-[#1A1A24] border text-[#F0EFFF] placeholder-[#5A5A78] text-sm focus:outline-none focus:border-[#6C47FF] focus:shadow-[0_0_0_3px_#6C47FF20] transition-all ${errors.password ? 'border-[#FF6B6B]' : 'border-[#2A2A3A]'}`} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A78] hover:text-[#9494B0]">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-[#FF6B6B] flex items-center gap-1"><AlertCircle size={11} />{errors.password}</span>}
            </div>
            <Button size="xl" type="submit" disabled={loading}>
              {loading ? '⟳ Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-xs text-center text-[#5A5A78]">Start free — no credit card needed</p>
          <p className="text-sm text-center text-[#9494B0] mt-4">
            Already have an account? <Link to="/login" className="text-[#6C47FF] hover:text-[#A78BFA]">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-[#111118] border-l border-[#2A2A3A] items-center justify-center p-12">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-[#6C47FF] flex items-center justify-center mx-auto mb-6">
            <Zap size={36} className="text-white" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">All your tools, one platform</h3>
          <p className="text-sm text-[#9494B0]">26 AI-powered marketing tools that work together seamlessly.</p>
          <div className="grid grid-cols-3 gap-2 mt-6">
            {['Blog Writer', 'Ad Copy', 'Campaign Builder', 'SEO Brief', 'Caption Gen', 'Analytics'].map(t => (
              <div key={t} className="bg-[#1A1A24] border border-[#2A2A3A] rounded-lg p-2 text-xs text-[#9494B0]">{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SignIn() {
  const navigate = useNavigate()
  const { login } = useAppStore()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please enter your email and password.'); return }
    if (!validateEmail(form.email)) { setError('Enter a valid email address.'); return }
    setLoading(true)
    // Simulate API call — replace with real fetch to /api/auth/login
    await new Promise(r => setTimeout(r, 800))
    // Demo: any valid email/password works
    login(form.email, form.email.split('@')[0], 'agency')
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#6C47FF] flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg">
            <span className="text-[#6C47FF]">Mark</span>AI Pro
          </span>
        </div>

        <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-8">
          <h1 className="font-display font-bold text-2xl mb-6 text-center">Welcome back</h1>

          <Button variant="ghost" size="lg" className="w-full mb-4 justify-center" type="button">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#2A2A3A]" />
            <span className="text-xs text-[#5A5A78]">or</span>
            <div className="flex-1 h-px bg-[#2A2A3A]" />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FF6B6B15] border border-[#FF6B6B30] mb-4">
              <AlertCircle size={14} className="text-[#FF6B6B] flex-shrink-0" />
              <span className="text-xs text-[#FF6B6B]">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <Input label="Email address" type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@company.com" />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#9494B0]">Password</label>
                <a href="#" className="text-xs text-[#6C47FF] hover:text-[#A78BFA]">Forgot password?</a>
              </div>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Your password"
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] placeholder-[#5A5A78] text-sm focus:outline-none focus:border-[#6C47FF] transition-all" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A78]">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button size="xl" type="submit" disabled={loading}>
              {loading ? '⟳ Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-sm text-center text-[#9494B0]">
            Don't have an account? <Link to="/signup" className="text-[#6C47FF] hover:text-[#A78BFA]">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
