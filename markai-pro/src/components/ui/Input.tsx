import { cn } from '../../lib/utils'
import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-[#9494B0]">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'h-10 px-3 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] placeholder-[#5A5A78] text-sm',
          'focus:outline-none focus:border-[#6C47FF] focus:shadow-[0_0_0_3px_#6C47FF20]',
          'transition-all duration-200',
          error && 'border-[#FF6B6B]',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-[#FF6B6B]">{error}</span>}
    </div>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-[#9494B0]">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          'px-3 py-2.5 rounded-lg bg-[#1A1A24] border border-[#2A2A3A] text-[#F0EFFF] placeholder-[#5A5A78] text-sm resize-none',
          'focus:outline-none focus:border-[#6C47FF] focus:shadow-[0_0_0_3px_#6C47FF20]',
          'transition-all duration-200',
          className
        )}
        {...props}
      />
    </div>
  )
)
Textarea.displayName = 'Textarea'
