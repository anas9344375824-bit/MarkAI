import { Plan } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        plan: Plan
        credits: number
        workspaceId?: string
      }
      toolCreditCost?: number
    }
  }
}
