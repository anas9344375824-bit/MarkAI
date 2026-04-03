import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'
import { Check } from 'lucide-react'

const tabs = ['Profile', 'Brand', 'Team', 'Billing', 'Integrations', 'API']

const integrations = [
  { name: 'WordPress', icon: '🌐', connected: true },
  { name: 'Shopify', icon: '🛍️', connected: false },
  { name: 'Mailchimp', icon: '📧', connected: true },
  { name: 'Meta Ads', icon: '📣', connected: true },
  { name: 'Google Ads', icon: '🔍', connected: false },
  { name: 'Google Analytics', icon: '📊', connected: true },
  { name: 'HubSpot', icon: '🔶', connected: false },
  { name: 'Buffer', icon: '📅', connected: false },
  { name: 'Slack', icon: '💬', connected: true },
]

const teamMembers = [
  { name: 'Alex Carter', email: 'alex@agencyco.com', role: 'Admin', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { name: 'Jamie Lee', email: 'jamie@agencyco.com', role: 'Editor', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie' },
  { name: 'Sam Rivera', email: 'sam@agencyco.com', role: 'Viewer', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
  { name: 'Client User', email: 'client@techstart.com', role: 'Client', status: 'pending', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client' },
]

const invoices = [
  { date: 'Jul 1, 2025', amount: '$99.00', status: 'paid' },
  { date: 'Jun 1, 2025', amount: '$99.00', status: 'paid' },
  { date: 'May 1, 2025', amount: '$99.00', status: 'paid' },
]

const PLAN_LABELS: Record<string, string> = {
  free: 'Free', starter: 'Starter', pro: 'Pro', agency: 'Agency',
}
const PLAN_PRICES: Record<string, string> = {
  free: '$0/month', starter: '$19/month', pro: '$49/month', agency: '$99/month',
}

export default function Settings() {
  const { user, setUser, addNotification } = useAppStore()
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [apiRevealed, setApiRevealed] = useState(false)
  const [memberRoles, setMemberRoles] = useState<Record<string, string>>(
    Object.fromEntries(teamMembers.map(m => [m.email, m.role]))
  )
  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email })

  const handleSaveProfile = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      addNotification({ type: 'error', message: 'Name and email are required.' })
      return
    }
    setUser({ name: profileForm.name, email: profileForm.email })
    setSaved(true)
    addNotification({ type: 'success', message: 'Profile saved successfully.' })
    setTimeout(() => setSaved(false), 2000)
  }

  const creditsRemaining = user.credits.total - user.credits.used
  const creditPct = user.plan === 'agency' ? 5 : Math.max(0, (user.credits.used / user.credits.total) * 100)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl mb-1">Settings</h1>
        <p className="text-[#9494B0] text-sm">Manage your account, team, and integrations.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-[#111118] border border-[#2A2A3A] rounded-xl p-1 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t.toLowerCase())}
            className={cn('px-3 md:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              tab === t.toLowerCase() ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full bg-[#2A2A3A]" />
            <div>
              <Button variant="secondary" size="sm">Change avatar</Button>
              <p className="text-xs text-[#5A5A78] mt-1">JPG, PNG up to 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full name" value={profileForm.name}
              onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
            <Input label="Email address" type="email" value={profileForm.email}
              onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Timezone</label>
            <select className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
              <option value="UTC-5">UTC-5 (Eastern Time)</option>
              <option value="UTC-8">UTC-8 (Pacific Time)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+1">UTC+1 (CET)</option>
              <option value="UTC+5:30">UTC+5:30 (IST)</option>
            </select>
          </div>
          <div className="pt-4 border-t border-[#2A2A3A]">
            <h3 className="font-semibold text-[#F0EFFF] mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Current password" type="password" placeholder="••••••••" />
              <Input label="New password" type="password" placeholder="Min. 8 characters" />
            </div>
          </div>
          <Button onClick={handleSaveProfile}>
            {saved ? <><Check size={15} /> Saved!</> : 'Save changes'}
          </Button>
        </div>
      )}

      {tab === 'team' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => addNotification({ type: 'info', message: 'Invite email sent! (demo mode)' })}>
              Invite member
            </Button>
          </div>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-[#2A2A3A]">
                  {['Member', 'Email', 'Role', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-[#5A5A78] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(m => (
                  <tr key={m.email} className="border-b border-[#2A2A3A] last:border-0 hover:bg-[#1A1A24] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full bg-[#2A2A3A]" />
                        <span className="text-sm text-[#F0EFFF]">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-[#9494B0]">{m.email}</td>
                    <td className="px-5 py-3">
                      <select
                        value={memberRoles[m.email]}
                        onChange={e => setMemberRoles(prev => ({ ...prev, [m.email]: e.target.value }))}
                        className="bg-[#1A1A24] border border-[#2A2A3A] rounded text-xs text-[#9494B0] px-2 py-1 focus:outline-none focus:border-[#6C47FF] transition-all">
                        {['Admin', 'Editor', 'Viewer', 'Client'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={m.status === 'active' ? 'success' : 'warning'} className="capitalize text-[10px]">{m.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => addNotification({ type: 'info', message: `${m.name} removed (demo mode)` })}
                        className="text-xs text-[#FF6B6B] hover:text-[#E05555] transition-colors">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div className="space-y-4">
          <div className="bg-[#111118] border border-[#6C47FF30] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h3 className="font-semibold text-[#F0EFFF]">{PLAN_LABELS[user.plan]} Plan</h3>
                <p className="text-sm text-[#9494B0]">{PLAN_PRICES[user.plan]} · Renews Aug 1, 2025</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => addNotification({ type: 'info', message: 'Redirecting to Stripe portal...' })}>
                  Manage plan
                </Button>
              </div>
            </div>
            {user.plan !== 'agency' && (
              <div>
                <div className="flex items-center justify-between text-xs text-[#9494B0] mb-1.5">
                  <span>Credits used this month</span>
                  <span className="font-mono">{user.credits.used.toLocaleString()} / {user.credits.total.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[#2A2A3A] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6C47FF] rounded-full transition-all" style={{ width: `${creditPct}%` }} />
                </div>
              </div>
            )}
            {user.plan === 'agency' && (
              <p className="text-sm text-[#00D97E]">✓ Unlimited credits — Agency plan</p>
            )}
          </div>

          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
            <h3 className="font-semibold text-[#F0EFFF] mb-4">Payment Method</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A]">
              <div className="w-10 h-7 rounded bg-[#2A2A3A] flex items-center justify-center text-xs font-bold text-[#9494B0]">VISA</div>
              <span className="text-sm text-[#9494B0]">•••• •••• •••• 4242</span>
              <span className="text-xs text-[#5A5A78] ml-auto">Expires 12/27</span>
            </div>
            <Button variant="ghost" size="sm" className="mt-3"
              onClick={() => addNotification({ type: 'info', message: 'Redirecting to Stripe to update payment method...' })}>
              Update payment method
            </Button>
          </div>

          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[#2A2A3A]">
              <h3 className="font-semibold text-[#F0EFFF]">Invoice History</h3>
            </div>
            <table className="w-full">
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.date} className="border-b border-[#2A2A3A] last:border-0 hover:bg-[#1A1A24] transition-colors">
                    <td className="px-5 py-3 text-sm text-[#9494B0]">{inv.date}</td>
                    <td className="px-5 py-3 text-sm font-mono text-[#F0EFFF]">{inv.amount}</td>
                    <td className="px-5 py-3"><Badge variant="success" className="text-[10px]">{inv.status}</Badge></td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => addNotification({ type: 'success', message: 'Invoice downloaded (demo mode)' })}
                        className="text-xs text-[#6C47FF] hover:text-[#A78BFA]">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'integrations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {integrations.map(int => (
            <div key={int.name} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 card-glow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{int.icon}</span>
                <Badge variant={int.connected ? 'success' : 'info'} className="text-[10px]">
                  {int.connected ? 'Connected' : 'Not connected'}
                </Badge>
              </div>
              <h3 className="font-medium text-sm text-[#F0EFFF] mb-3">{int.name}</h3>
              <Button
                variant={int.connected ? 'danger' : 'secondary'}
                size="sm"
                className="w-full"
                onClick={() => addNotification({ type: 'info', message: `${int.connected ? 'Disconnecting' : 'Connecting'} ${int.name}... (demo mode)` })}>
                {int.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      )}

      {tab === 'api' && (
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-[#F0EFFF]">API Access</h3>
          <p className="text-sm text-[#9494B0]">Use the MarkAI Pro API to integrate our tools into your own applications.</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Your API Key</label>
            <div className="flex gap-2 flex-wrap">
              <input
                readOnly
                value={apiRevealed ? 'mk_live_a8f3d2e1b9c4f7a2d5e8b1c4f7a2d5e8' : 'mk_live_••••••••••••••••••••••••••••••••'}
                className="flex-1 min-w-0 h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#9494B0] text-sm font-mono focus:outline-none" />
              <Button variant="secondary" size="md" onClick={() => setApiRevealed(!apiRevealed)}>
                {apiRevealed ? 'Hide' : 'Reveal'}
              </Button>
              <Button variant="ghost" size="md"
                onClick={() => { setApiRevealed(false); addNotification({ type: 'success', message: 'API key regenerated. Old key is now invalid.' }) }}>
                Regenerate
              </Button>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[#FFB54710] border border-[#FFB54730]">
            <p className="text-xs text-[#FFB547]">⚠️ Keep your API key secret. Never expose it in client-side code.</p>
          </div>
        </div>
      )}

      {tab === 'brand' && (
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 space-y-5">
          <Input label="Brand name" placeholder="Your brand name" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#9494B0]">Default tone</label>
            <select className="h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] text-sm focus:outline-none focus:border-[#6C47FF] transition-all">
              {['Professional', 'Friendly', 'Bold', 'Conversational', 'Authoritative'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Input label="Industry" placeholder="e.g. SaaS / Software" />
          <Input label="Target audience" placeholder="e.g. Marketing managers at B2B SaaS companies" />
          <Button onClick={() => addNotification({ type: 'success', message: 'Brand settings saved.' })}>
            Save brand settings
          </Button>
        </div>
      )}
    </div>
  )
}
