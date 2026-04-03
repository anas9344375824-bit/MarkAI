import { resend } from '../config/resend'
import { prisma } from '../config/prisma'
import { env } from '../config/env'

type EmailType =
  | 'welcome'
  | 'verifyEmail'
  | 'passwordReset'
  | 'contentApproval'
  | 'approvalReceived'
  | 'upgradeConfirmation'
  | 'paymentFailed'
  | 'creditsLow'
  | 'monthlyCreditsReset'
  | 'teamInvite'
  | 'subscriptionEnded'

const SUBJECTS: Record<EmailType, string> = {
  welcome: 'Welcome to MarkAI Pro 🚀',
  verifyEmail: 'Verify your email address',
  passwordReset: 'Reset your password',
  contentApproval: 'Content ready for your review',
  approvalReceived: 'Client responded to your content',
  upgradeConfirmation: 'Your plan has been upgraded!',
  paymentFailed: 'Action required: Payment failed',
  creditsLow: 'Your credits are running low',
  monthlyCreditsReset: 'Your credits have been renewed',
  teamInvite: "You've been invited to join a workspace",
  subscriptionEnded: 'Your MarkAI Pro subscription has ended',
}

const buildHtml = (title: string, body: string, cta?: { text: string; url: string }): string => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08080C;font-family:'DM Sans',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:24px;font-weight:700;color:#6C47FF">Mark</span>
      <span style="font-size:24px;font-weight:700;color:#F0EFFF">AI Pro</span>
    </div>
    <div style="background:#111118;border:1px solid #2A2A3A;border-radius:16px;padding:40px">
      <h1 style="color:#F0EFFF;font-size:24px;margin:0 0 16px">${title}</h1>
      <div style="color:#9494B0;font-size:15px;line-height:1.6">${body}</div>
      ${cta ? `
      <div style="text-align:center;margin-top:32px">
        <a href="${cta.url}" style="display:inline-block;background:#6C47FF;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px">${cta.text}</a>
      </div>` : ''}
    </div>
    <p style="text-align:center;color:#5A5A78;font-size:12px;margin-top:24px">
      © 2025 MarkAI Pro · <a href="${env.FRONTEND_URL}/privacy" style="color:#5A5A78">Privacy</a> · <a href="${env.FRONTEND_URL}/terms" style="color:#5A5A78">Terms</a>
    </p>
  </div>
</body>
</html>
`

const EMAIL_BODIES: Record<EmailType, (data: Record<string, unknown>) => { body: string; cta?: { text: string; url: string } }> = {
  welcome: (d) => ({
    body: `<p>Hi ${d.name ?? 'there'},</p><p>Welcome to MarkAI Pro! Your account is ready. You have <strong style="color:#6C47FF">50 free credits</strong> to get started.</p><p>Explore all 26 AI marketing tools and start creating content that converts.</p>`,
    cta: { text: 'Start creating →', url: `${env.FRONTEND_URL}/dashboard` },
  }),
  verifyEmail: (d) => ({
    body: `<p>Please verify your email address to activate your MarkAI Pro account.</p><p>This link expires in 24 hours.</p>`,
    cta: { text: 'Verify email address', url: `${env.FRONTEND_URL}/verify-email?token=${d.token}` },
  }),
  passwordReset: (d) => ({
    body: `<p>You requested a password reset. Click the button below to set a new password.</p><p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
    cta: { text: 'Reset password', url: `${env.FRONTEND_URL}/reset-password?token=${d.token}` },
  }),
  contentApproval: (d) => ({
    body: `<p>Hi ${d.clientName ?? 'there'},</p><p><strong>${d.agencyName ?? 'Your agency'}</strong> has shared content for your review.</p><p>Please review and approve or request changes.</p>`,
    cta: { text: 'Review content', url: `${env.FRONTEND_URL}/approve/${d.token}` },
  }),
  approvalReceived: (d) => ({
    body: `<p>Your client has responded to the content you sent for approval.</p><p>Status: <strong style="color:${d.status === 'approved' ? '#00D97E' : '#FFB547'}">${d.status}</strong></p>${d.notes ? `<p>Notes: ${d.notes}</p>` : ''}`,
    cta: { text: 'View in dashboard', url: `${env.FRONTEND_URL}/content/${d.contentId}` },
  }),
  upgradeConfirmation: (d) => ({
    body: `<p>Your plan has been upgraded to <strong style="color:#6C47FF">${d.plan}</strong>. Your new credits are now available.</p><p>Thank you for upgrading!</p>`,
    cta: { text: 'Go to dashboard', url: `${env.FRONTEND_URL}/dashboard` },
  }),
  paymentFailed: (d) => ({
    body: `<p>We couldn't process your payment. Please update your payment method to keep your MarkAI Pro subscription active.</p><p>You have a 7-day grace period before your account is downgraded.</p>`,
    cta: { text: 'Update payment method', url: d.retryUrl as string || `${env.FRONTEND_URL}/billing` },
  }),
  creditsLow: () => ({
    body: `<p>You're running low on credits. Top up now to keep creating content without interruption.</p>`,
    cta: { text: 'Top up credits', url: `${env.FRONTEND_URL}/billing` },
  }),
  monthlyCreditsReset: (d) => ({
    body: `<p>Your monthly credits have been renewed! You now have <strong style="color:#6C47FF">${d.credits}</strong> credits available.</p>`,
    cta: { text: 'Start creating', url: `${env.FRONTEND_URL}/tools` },
  }),
  teamInvite: (d) => ({
    body: `<p><strong>${d.inviterName}</strong> has invited you to join their MarkAI Pro workspace as a <strong>${d.role}</strong>.</p>`,
    cta: { text: 'Accept invitation', url: `${env.FRONTEND_URL}/accept-invite?token=${d.token}` },
  }),
  subscriptionEnded: () => ({
    body: `<p>Your MarkAI Pro subscription has ended. Your account has been moved to the free plan.</p><p>All your content is safe. Resubscribe anytime to regain full access.</p>`,
    cta: { text: 'Resubscribe', url: `${env.FRONTEND_URL}/billing` },
  }),
}

export const sendEmail = async (
  type: EmailType,
  userId: string,
  data: Record<string, unknown>
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
    if (!user) return

    const { body, cta } = EMAIL_BODIES[type]({ ...data, name: user.name })
    const html = buildHtml(SUBJECTS[type], body, cta)

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: user.email,
      reply_to: env.EMAIL_REPLY_TO,
      subject: SUBJECTS[type],
      html,
    })
  } catch (err) {
    console.error(`Failed to send ${type} email:`, err)
  }
}

export const sendEmailToAddress = async (
  type: EmailType,
  toEmail: string,
  data: Record<string, unknown>
): Promise<void> => {
  try {
    const { body, cta } = EMAIL_BODIES[type](data)
    const html = buildHtml(SUBJECTS[type], body, cta)
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: toEmail,
      reply_to: env.EMAIL_REPLY_TO,
      subject: SUBJECTS[type],
      html,
    })
  } catch (err) {
    console.error(`Failed to send ${type} email to ${toEmail}:`, err)
  }
}
