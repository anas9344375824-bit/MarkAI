import { cn } from '../../lib/utils'

export function Card({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'bg-[#111118] border border-[#2A2A3A] rounded-xl p-5 transition-all duration-200',
        onClick && 'cursor-pointer card-glow hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-5">
      <div className="shimmer h-4 w-3/4 rounded mb-3" />
      <div className="shimmer h-3 w-full rounded mb-2" />
      <div className="shimmer h-3 w-2/3 rounded" />
    </div>
  )
}
