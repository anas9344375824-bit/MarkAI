import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const STYLES = {
  success: 'border-[#00D97E40] bg-[#00D97E10] text-[#00D97E]',
  error: 'border-[#FF6B6B40] bg-[#FF6B6B10] text-[#FF6B6B]',
  warning: 'border-[#FFB54740] bg-[#FFB54710] text-[#FFB547]',
  info: 'border-[#6C47FF40] bg-[#6C47FF10] text-[#A78BFA]',
}

export function ToastContainer({ notifications, onRemove }: {
  notifications: Toast[]
  onRemove: (id: string) => void
}) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {notifications.map(n => {
        const Icon = ICONS[n.type]
        return (
          <div key={n.id}
            className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-2', STYLES[n.type])}>
            <Icon size={16} className="flex-shrink-0" />
            <span className="text-sm text-[#F0EFFF] flex-1">{n.message}</span>
            <button onClick={() => onRemove(n.id)} className="text-[#5A5A78] hover:text-[#F0EFFF] transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
