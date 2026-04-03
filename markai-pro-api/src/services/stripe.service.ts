import { stripe } from '../config/stripe'
import { prisma } from '../config/prisma'
import { env } from '../config/env'
import { Plan } from '@prisma/client'
import { resetMonthlyCredits } from './credits.service'
import { sendEmail } from './email.service'
import { PLAN_CREDITS } from '../types/ai.types'

const PRICE_MAP: Record<string, { plan: Plan; interval: string }> = {
  [env.STRIPE_PRICE_STARTER_MONTHLY ?? '']: { plan: 'STARTER', interval: 'monthly' },
  [env.STRIPE_PRICE_STARTER_ANNUAL ?? '']: { plan: 'STARTER', interval: 'annual' },
  [env.STRIPE_PRICE_PRO_MONTHLY ?? '']: { plan: 'PRO', interval: 'monthly' },
  [env.STRIPE_PRICE_PRO_ANNUAL ?? '']: { plan: 'PRO', interval: 'annual' },
  [env.STRIPE_PRICE_AGENCY_MONTHLY ?? '']: { plan: 'AGENCY', interval: 'monthly' },
  [env.STRIPE_PRICE_AGENCY_ANNUAL ?? '']: { plan: 'AGENCY', interval: 'annual' },
}

export const createOrGetStripeCustomer = async (userId: string, email: string, name: string): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { stripeCustomerId: true } })
  if (user?.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({ email, name, metadata: { userId } })
  await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customer.id } })
  return customer.id
}

export const createCheckoutSession = async (
  userId: string,
  email: string,
  name: string,
  plan: Plan,
  interval: 'monthly' | 'annual'
): Promise<string> => {
  const customerId = await createOrGetStripeCustomer(userId, email, name)
  const priceKey = `STRIPE_PRICE_${plan}_${interval.toUpperCase()}` as keyof typeof env
  const priceId = env[priceKey] as string | undefined

  if (!priceId) throw new Error(`No price configured for ${plan} ${interval}`)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.FRONTEND_URL}/billing?success=true`,
    cancel_url: `${env.FRONTEND_URL}/billing?cancelled=true`,
    metadata: { userId, plan, interval },
  })

  return session.url!
}

export const createPortalSession = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { stripeCustomerId: true } })
  if (!user?.stripeCustomerId) throw new Error('No Stripe customer found')

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${env.FRONTEND_URL}/settings?tab=billing`,
  })
  return session.url
}

export const handleWebhook = async (payload: Buffer, signature: string): Promise<void> => {
  const event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const { userId, plan } = session.metadata ?? {}
      if (!userId || !plan) break

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: plan as Plan,
          credits: PLAN_CREDITS[plan as Plan],
          stripeSubId: session.subscription as string,
        },
      })
      await prisma.invoice.create({
        data: {
          userId,
          stripeInvoiceId: session.id,
          amount: session.amount_total ?? 0,
          status: 'PAID',
          plan: plan as Plan,
          periodStart: new Date(),
          periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
      await sendEmail('upgradeConfirmation', userId, { plan })
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object
      const customerId = invoice.customer as string
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (!user) break

      await resetMonthlyCredits(user.id, user.plan)
      await prisma.invoice.create({
        data: {
          userId: user.id,
          stripeInvoiceId: invoice.id,
          amount: invoice.amount_paid,
          status: 'PAID',
          plan: user.plan,
          periodStart: new Date((invoice.period_start ?? 0) * 1000),
          periodEnd: new Date((invoice.period_end ?? 0) * 1000),
        },
      })
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object
      const customerId = sub.customer as string
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (!user) break

      const priceId = sub.items.data[0]?.price.id
      const planInfo = priceId ? PRICE_MAP[priceId] : null
      if (planInfo) {
        await prisma.user.update({ where: { id: user.id }, data: { plan: planInfo.plan } })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const customerId = sub.customer as string
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (!user) break

      await prisma.user.update({
        where: { id: user.id },
        data: { plan: 'FREE', credits: PLAN_CREDITS.FREE, stripeSubId: null },
      })
      await sendEmail('subscriptionEnded', user.id, {})
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      const customerId = invoice.customer as string
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (!user) break
      await sendEmail('paymentFailed', user.id, { retryUrl: invoice.hosted_invoice_url ?? '' })
      break
    }
  }
}
