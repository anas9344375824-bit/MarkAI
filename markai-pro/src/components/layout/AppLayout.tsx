import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useAppStore } from '../../store/appStore'
import { useEffect } from 'react'
import { ToastContainer } from '../ui/Toast'

export function AppLayout() {
  const { sidebarOpen, setSidebarOpen, isAuthenticated, notifications, removeNotification } = useAppStore()
  const location = useLocation()

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [location.pathname, setSidebarOpen])

  // Auth guard
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <div className="min-h-screen bg-[#08080C]">
      <Sidebar />

      {/* Mobile overlay — closes sidebar on outside click */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Navbar />

      <main
        className="pt-[60px] min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarOpen ? '240px' : window.innerWidth < 768 ? '0' : '64px' }}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* Toast notifications */}
      <ToastContainer notifications={notifications} onRemove={removeNotification} />
    </div>
  )
}
