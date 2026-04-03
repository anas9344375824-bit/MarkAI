import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="font-mono font-bold text-8xl text-[#6C47FF] mb-4">404</div>
        <h1 className="font-display font-bold text-2xl text-[#F0EFFF] mb-2">Page not found</h1>
        <p className="text-sm text-[#9494B0] mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    </div>
  )
}
