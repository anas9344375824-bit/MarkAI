import { Component, type ReactNode } from 'react'
import { Button } from '../ui/Button'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: string }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message }
  }

  componentDidCatch(error: Error) {
    console.error('[MarkAI Pro Error]', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="font-display font-bold text-2xl text-[#F0EFFF] mb-2">Something went wrong</h1>
            <p className="text-sm text-[#9494B0] mb-6">An unexpected error occurred. Our team has been notified.</p>
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-4 mb-6 text-left">
              <code className="text-xs text-[#FF6B6B] font-mono">{this.state.error}</code>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => this.setState({ hasError: false, error: '' })}>Try again</Button>
              <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>Go to dashboard</Button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
