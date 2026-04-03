import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-[#6C47FF] text-white hover:bg-[#4A2FD4]',
      secondary: 'bg-transparent border border-[#6C47FF] text-[#6C47FF] hover:bg-[#6C47FF15]',
      ghost: 'bg-transparent border border-[#2A2A3A] text-[#9494B0] hover:border-[#6C47FF] hover:text-[#F0EFFF]',
      danger: 'bg-[#FF6B6B] text-white hover:bg-[#E05555]',
    }
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-base w-full',
    }
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
