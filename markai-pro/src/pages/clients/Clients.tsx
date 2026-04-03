import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ExternalLink } from 'lucide-react'
import { mockClients } from '../../data/mockData'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { mockContent } from '../../data/mockData'
import { statusBadge } from '../../components/ui/Badge'
import { cn } from '../../lib/utils'

export function ClientsList() {
  const navigate = useNavigate()
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">Clients</h1>
          <p className="text-[#9494B0] text-sm">Manage all your client workspaces.</p>
        </div>
        <Button><Plus size={16} /> Add Client</Button>
      </div>

      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A3A]">
              {['Client', 'Industry', 'Active Campaigns', 'Last Active', 'Status', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs text-[#5A5A78] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockClients.map(client => (
              <tr key={client.id} onClick={() => navigate(`/clients/${client.id}`)}
                className="border-b border-[#2A2A3A] last:border-0 hover:bg-[#1A1A24] transition-colors cursor-pointer">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: client.color + '20' }}>
                      {client.logo}
                    </div>
                    <span className="font-medium text-sm text-[#F0EFFF]">{client.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[#9494B0]">{client.industry}</td>
                <td className="px-5 py-4 text-sm text-[#F0EFFF]">{client.activeCampaigns}</td>
                <td className="px-5 py-4 text-sm text-[#9494B0]">{client.lastActive}</td>
                <td className="px-5 py-4">
                  <Badge variant="success" className="capitalize">{client.status}</Badge>
                </td>
                <td className="px-5 py-4">
                  <ExternalLink size={15} className="text-[#5A5A78]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ClientDetail() {
  const [tab, setTab] = useState('overview')
  const client = mockClients[0]
  const tabs = ['Overview', 'Content', 'Campaigns', 'Brand Voice', 'Reports', 'Settings']

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 p-5 bg-[#111118] border border-[#2A2A3A] rounded-xl">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: client.color + '20' }}>
          {client.logo}
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-[#F0EFFF]">{client.name}</h1>
          <p className="text-sm text-[#9494B0]">{client.industry}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <Badge variant="success">Active</Badge>
          <Button size="sm">New Campaign</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#111118] border border-[#2A2A3A] rounded-xl p-1 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t.toLowerCase())}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all', tab === t.toLowerCase() ? 'bg-[#6C47FF] text-white' : 'text-[#9494B0] hover:text-[#F0EFFF]')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total content', value: '84' },
              { label: 'Active campaigns', value: '2' },
              { label: 'Pending approvals', value: '3' },
              { label: 'Last active', value: '2h ago' },
            ].map(s => (
              <div key={s.label} className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4">
                <div className="text-2xl font-bold text-[#F0EFFF] font-mono mb-1">{s.value}</div>
                <div className="text-xs text-[#9494B0]">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
            <h3 className="font-semibold text-[#F0EFFF] mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {['Blog post approved: "AI Marketing Guide"', 'Campaign "Q4 Black Friday Push" updated', 'New content generated: 5 Instagram captions', 'Brand voice profile updated'].map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#9494B0]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6C47FF]" />
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A3A]">
                {['Type', 'Title', 'Platform', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-[#5A5A78] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockContent.map(item => (
                <tr key={item.id} className="border-b border-[#2A2A3A] last:border-0 hover:bg-[#1A1A24] transition-colors">
                  <td className="px-4 py-3"><Badge variant="ai-core" className="text-[10px]">{item.type}</Badge></td>
                  <td className="px-4 py-3 text-sm text-[#F0EFFF] max-w-[200px] truncate">{item.title}</td>
                  <td className="px-4 py-3 text-xs text-[#9494B0]">{item.platform}</td>
                  <td className="px-4 py-3"><Badge variant={statusBadge(item.status)} className="text-[10px] capitalize">{item.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {item.status === 'draft' && <Button variant="secondary" size="sm">Send for approval</Button>}
                      {item.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-[#00D97E] hover:bg-[#00B868]">Approve</Button>
                          <Button variant="ghost" size="sm">Changes</Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
