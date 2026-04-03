import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockUser, mockCampaigns, mockContent, mockDashboardStats } from '../data/mockData'

export type Plan = 'free' | 'starter' | 'pro' | 'agency'

export interface AppUser {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  plan: Plan
  credits: { used: number; total: number }
  onboardingDone: boolean
}

const PLAN_CREDITS: Record<Plan, number> = {
  free: 10,
  starter: 100,
  pro: 500,
  agency: 999999,
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface AppState {
  user: AppUser
  campaigns: typeof mockCampaigns
  content: typeof mockContent
  sidebarOpen: boolean
  isAuthenticated: boolean
  notifications: Notification[]

  setSidebarOpen: (open: boolean) => void
  setUser: (user: Partial<AppUser>) => void
  login: (email: string, name: string, plan?: Plan) => void
  logout: () => void
  deductCredit: (amount: number) => boolean
  addCredits: (amount: number) => void
  resetCredits: () => void
  upgradePlan: (plan: Plan) => void
  addNotification: (n: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  addContent: (item: typeof mockContent[0]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        ...mockUser,
        plan: 'agency' as Plan,
        credits: { used: mockDashboardStats.contentCreated * 8, total: PLAN_CREDITS.agency },
        onboardingDone: true,
      },
      campaigns: mockCampaigns,
      content: mockContent,
      sidebarOpen: true,
      isAuthenticated: true,
      notifications: [],

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setUser: (updates) => set(state => ({ user: { ...state.user, ...updates } })),

      login: (email, name, plan = 'free') => set({
        isAuthenticated: true,
        user: {
          id: crypto.randomUUID(),
          email,
          name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          role: 'user',
          plan,
          credits: { used: 0, total: PLAN_CREDITS[plan] },
          onboardingDone: false,
        },
      }),

      logout: () => set({
        isAuthenticated: false,
        user: {
          id: '',
          email: '',
          name: '',
          avatar: '',
          role: 'user',
          plan: 'free',
          credits: { used: 0, total: PLAN_CREDITS.free },
          onboardingDone: false,
        },
      }),

      deductCredit: (amount) => {
        const { user } = get()
        if (user.plan === 'agency') return true // unlimited
        const remaining = user.credits.total - user.credits.used
        if (remaining < amount) return false
        set(state => ({
          user: {
            ...state.user,
            credits: { ...state.user.credits, used: state.user.credits.used + amount },
          },
        }))
        return true
      },

      addCredits: (amount) => set(state => ({
        user: {
          ...state.user,
          credits: { ...state.user.credits, total: state.user.credits.total + amount },
        },
      })),

      resetCredits: () => set(state => ({
        user: {
          ...state.user,
          credits: { used: 0, total: PLAN_CREDITS[state.user.plan] },
        },
      })),

      upgradePlan: (plan) => set(state => ({
        user: {
          ...state.user,
          plan,
          credits: { used: state.user.credits.used, total: PLAN_CREDITS[plan] },
        },
      })),

      addNotification: (n) => {
        const id = crypto.randomUUID()
        set(state => ({ notifications: [...state.notifications, { ...n, id }] }))
        setTimeout(() => get().removeNotification(id), 4000)
      },

      removeNotification: (id) => set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),

      addContent: (item) => set(state => ({
        content: [item, ...state.content],
      })),
    }),
    {
      name: 'markai-pro-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
