import { cn } from '../../lib/utils'

type BadgeVariant = 'ai-core' | 'money' | 'lock-in' | 'agency' | 'new' | 'success' | 'warning' | 'error' | 'info'

const variants: Record<BadgeVariant, string> = {
  'ai-core': 'bg-[#6C47FF20] text-[#A78BFA] border border-[#6C47FF40]',
  'money': 'bg-[#FFB54720] text-[#FFB547] border border-[#FFB54740]',
  'lock-in': 'bg-[#00D97E20] text-[#00D97E] border border-[#00D97E40]',
  'agency': 'bg-[#00C8FF20] text-[#00C8FF] border border-[#00C8FF40]',
  'new': 'bg-gradient-to-r from-[#6C47FF] to-[#00C8FF] text-white',
  'success': 'bg-[#00D97E20] text-[#00D97E] border border-[#00D97E40]',
  'warning': 'bg-[#FFB54720] text-[#FFB547] border border-[#FFB54740]',
  'error': 'bg-[#FF6B6B20] text-[#FF6B6B] border border-[#FF6B6B40]',
  'info': 'bg-[#00C8FF20] text-[#00C8FF] border border-[#00C8FF40]',
}

export function Badge({ variant = 'ai-core', children, className }: { variant?: BadgeVariant; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

export function badgeForTool(badge: string): BadgeVariant {
  if (badge === 'Money Feature') return 'money'
  if (badge === 'Lock-in') return 'lock-in'
  if (badge === 'Agency') return 'agency'
  return 'ai-core'
}

export function statusBadge(status: string): BadgeVariant {
  if (status === 'published' || status === 'approved' || status === 'active') return 'success'
  if (status === 'pending') return 'warning'
  if (status === 'draft') return 'info'
  return 'info'
}
