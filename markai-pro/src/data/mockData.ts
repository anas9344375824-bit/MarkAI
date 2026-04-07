export const mockUser = {
  id: '1',
  name: 'Alex Carter',
  email: 'alex@agencyco.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'Marketing Agency Owner',
  plan: 'agency' as const,
  credits: { used: 1840, total: 5000 },
}

export const mockClients = [
  { id: '1', name: 'TechStart Inc', industry: 'SaaS', logo: '🚀', color: '#6C47FF', activeCampaigns: 2, lastActive: '2 hours ago', status: 'active' },
  { id: '2', name: 'Bloom Beauty Co', industry: 'Beauty & Cosmetics', logo: '🌸', color: '#FF6B9D', activeCampaigns: 1, lastActive: '1 day ago', status: 'active' },
  { id: '3', name: 'FitLife App', industry: 'Health & Fitness', logo: '💪', color: '#00D97E', activeCampaigns: 1, lastActive: '3 hours ago', status: 'active' },
]

export const mockCampaigns = [
  {
    id: '1', name: 'Q4 Black Friday Push', client: 'TechStart Inc', clientColor: '#6C47FF',
    platforms: ['Instagram', 'LinkedIn', 'Google Ads', 'Email', 'Facebook'],
    contentCount: 38, status: 'active', progress: 72,
    startDate: '2025-11-01', endDate: '2025-11-30',
    goal: 'Sales/Conversion',
  },
  {
    id: '2', name: 'Bloom Autumn Collection', client: 'Bloom Beauty Co', clientColor: '#FF6B9D',
    platforms: ['Instagram', 'Email'],
    contentCount: 22, status: 'active', progress: 45,
    startDate: '2025-10-15', endDate: '2025-11-15',
    goal: 'Brand Awareness',
  },
  {
    id: '3', name: 'FitLife January Relaunch', client: 'FitLife App', clientColor: '#00D97E',
    platforms: ['Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube', 'Google Ads', 'Email', 'Blog'],
    contentCount: 61, status: 'active', progress: 20,
    startDate: '2025-01-01', endDate: '2025-01-31',
    goal: 'Product Launch',
  },
]

export const mockContent = [
  { id: '1', type: 'Blog Post', title: 'How AI is Transforming Digital Marketing in 2025', date: '2025-07-10', platform: 'Blog/SEO', status: 'published', words: 2100 },
  { id: '2', type: 'Ad Copy', title: 'Black Friday Sale — 50% Off All Plans [Google Ads]', date: '2025-07-09', platform: 'Google Ads', status: 'approved', words: 120 },
  { id: '3', type: 'Caption', title: 'Autumn Collection Launch — Instagram Carousel', date: '2025-07-09', platform: 'Instagram', status: 'published', words: 85 },
  { id: '4', type: 'Email', title: 'Welcome to FitLife — Your Journey Starts Now', date: '2025-07-08', platform: 'Email', status: 'published', words: 340 },
  { id: '5', type: 'Blog Post', title: '10 Proven Strategies to Grow Your Email List Fast', date: '2025-07-08', platform: 'Blog/SEO', status: 'draft', words: 1850 },
  { id: '6', type: 'Ad Copy', title: 'FitLife App — New Year New You [Meta Ads]', date: '2025-07-07', platform: 'Meta Ads', status: 'pending', words: 95 },
  { id: '7', type: 'Caption', title: 'TechStart Product Demo — LinkedIn Post', date: '2025-07-07', platform: 'LinkedIn', status: 'approved', words: 210 },
  { id: '8', type: 'Script', title: 'FitLife App Promo — 60s YouTube Script', date: '2025-07-06', platform: 'YouTube', status: 'draft', words: 480 },
  { id: '9', type: 'Email', title: 'Bloom Beauty — Exclusive Early Access Offer', date: '2025-07-06', platform: 'Email', status: 'published', words: 290 },
  { id: '10', type: 'Blog Post', title: 'The Ultimate Guide to Social Media Scheduling', date: '2025-07-05', platform: 'Blog/SEO', status: 'published', words: 2400 },
]

export const mockDashboardStats = {
  contentCreated: 127,
  activeCampaigns: 4,
  timeSaved: 18.4,
  wordsGenerated: 64200,
}

export const tools = [
  // Content
  { id: 'blog-writer', name: 'Blog Writer', desc: 'Full SEO articles in seconds', category: 'Content', badge: 'AI Core', icon: '✍️', uses: 48 },
  { id: 'social-caption', name: 'Social Caption Generator', desc: 'Platform-aware captions for all channels', category: 'Content', badge: 'AI Core', icon: '📱', uses: 124 },
  { id: 'email-sequence', name: 'Email Sequence Builder', desc: 'Drip campaigns from one goal', category: 'Content', badge: 'Money Feature', icon: '📧', uses: 31 },
  { id: 'video-script', name: 'Video Script Writer', desc: 'Hook, body, CTA structured scripts', category: 'Content', badge: 'AI Core', icon: '🎬', uses: 22 },
  { id: 'image-prompt', name: 'Image Prompt Maker', desc: 'Ready-to-use Midjourney/DALL·E prompts', category: 'Content', badge: 'AI Core', icon: '🎨', uses: 67 },
  { id: 'campaign-builder', name: 'Campaign Builder', desc: 'One brief → full multi-channel campaign', category: 'Content', badge: 'Money Feature', icon: '🚀', uses: 15 },
  // Ads
  { id: 'ad-copy', name: 'Ad Copy Generator', desc: 'Google, Meta, LinkedIn variants', category: 'Ads', badge: 'Money Feature', icon: '📣', uses: 89 },
  { id: 'landing-page', name: 'Landing Page Writer', desc: 'Ad + page paired for message match', category: 'Ads', badge: 'Money Feature', icon: '🏠', uses: 34 },
  { id: 'ab-headline', name: 'A/B Headline Tester', desc: '10 variants scored by psychology', category: 'Ads', badge: 'AI Core', icon: '🧪', uses: 41 },
  { id: 'cta-optimizer', name: 'CTA Optimizer', desc: 'Turn weak CTAs into high-converting ones', category: 'Ads', badge: 'Money Feature', icon: '⚡', uses: 56 },
  // SEO
  { id: 'keyword-cluster', name: 'Keyword Cluster Tool', desc: 'Topic → intent-labelled keyword clusters', category: 'SEO', badge: 'Lock-in', icon: '🔑', uses: 38 },
  { id: 'seo-brief', name: 'SEO Brief Generator', desc: 'Keyword → full content brief with headings', category: 'SEO', badge: 'AI Core', icon: '📋', uses: 29 },
  { id: 'meta-tag', name: 'Meta Tag Writer', desc: 'Title + description optimised for CTR', category: 'SEO', badge: 'AI Core', icon: '🏷️', uses: 72 },
  { id: 'repurposer', name: 'Content Repurposer', desc: 'Blog → 10 social posts + email + script', category: 'SEO', badge: 'Lock-in', icon: '♻️', uses: 44 },
  { id: 'off-page-seo', name: 'Off-Page SEO', desc: 'Backlinks, guest posts & outreach strategy', category: 'SEO', badge: 'AI Core', icon: '🔗', uses: 0 },
  { id: 'technical-seo', name: 'Technical SEO Audit', desc: 'Site audit, robots.txt, sitemap & Core Web Vitals', category: 'SEO', badge: 'AI Core', icon: '⚙️', uses: 0 },
  { id: 'local-seo', name: 'Local SEO', desc: 'Google Business Profile, NAP & local citations', category: 'SEO', badge: 'AI Core', icon: '📍', uses: 0 },
  { id: 'ecommerce-seo', name: 'E-commerce SEO', desc: 'Product titles, schema & Shopify/Amazon SEO', category: 'SEO', badge: 'Money Feature', icon: '🛒', uses: 0 },
  { id: 'voice-search-seo', name: 'Voice Search SEO', desc: 'FAQ, featured snippets & speakable schema', category: 'SEO', badge: 'AI Core', icon: '🎙️', uses: 0 },
  { id: 'image-seo', name: 'Image SEO', desc: 'Alt text, file names & image sitemap', category: 'SEO', badge: 'AI Core', icon: '🖼️', uses: 0 },
  { id: 'mobile-seo', name: 'Mobile SEO', desc: 'Mobile-first audit, AMP & page speed fixes', category: 'SEO', badge: 'AI Core', icon: '📱', uses: 0 },
  { id: 'international-seo', name: 'International SEO', desc: 'Hreflang tags, localization & country keywords', category: 'SEO', badge: 'AI Core', icon: '🌍', uses: 0 },
  { id: 'white-hat-checker', name: 'White-Hat SEO Checker', desc: 'Google compliance & E-E-A-T analysis', category: 'SEO', badge: 'Lock-in', icon: '✅', uses: 0 },
  // Strategy
  { id: 'competitor-spy', name: 'Competitor Spy Tool', desc: 'URL → messaging gaps + counter-strategy', category: 'Strategy', badge: 'Money Feature', icon: '🕵️', uses: 18 },
  { id: 'persona-builder', name: 'Audience Persona Builder', desc: 'Deep ICP with pain points + hooks', category: 'Strategy', badge: 'AI Core', icon: '👤', uses: 25 },
  { id: 'analytics-narrator', name: 'Analytics Narrator', desc: 'Data → human-readable performance report', category: 'Strategy', badge: 'Money Feature', icon: '📊', uses: 12 },
  { id: 'funnel-planner', name: 'Marketing Funnel Planner', desc: 'Goal → full funnel content map', category: 'Strategy', badge: 'AI Core', icon: '🔻', uses: 9 },
  // Agency
  { id: 'brand-voice', name: 'Brand Voice Trainer', desc: 'Upload samples → AI learns the voice', category: 'Agency', badge: 'Lock-in', icon: '🎙️', uses: 7 },
  { id: 'client-workspace', name: 'Client Workspace', desc: 'Separate workspace per client', category: 'Agency', badge: 'Agency', icon: '🏢', uses: 33 },
  { id: 'approval-flow', name: 'Content Approval Flow', desc: 'Create → review → approve in-platform', category: 'Agency', badge: 'Agency', icon: '✅', uses: 21 },
  { id: 'white-label-report', name: 'White-label Report Builder', desc: 'Branded PDF reports', category: 'Agency', badge: 'Agency', icon: '📄', uses: 14 },
  // Scheduling
  { id: 'content-calendar', name: 'Content Calendar', desc: '30-day calendar from one brief', category: 'Scheduling', badge: 'Lock-in', icon: '📅', uses: 52 },
  { id: 'social-scheduler', name: 'Social Media Scheduler', desc: 'Plan + publish to all platforms', category: 'Scheduling', badge: 'Lock-in', icon: '⏰', uses: 63 },
  { id: 'email-planner', name: 'Email Campaign Planner', desc: 'Full email marketing calendar', category: 'Scheduling', badge: 'AI Core', uses: 19, icon: '📆' },
  { id: 'performance-tracker', name: 'Performance Tracker', desc: 'Campaign metrics in one view', category: 'Scheduling', badge: 'Money Feature', icon: '📈', uses: 27 },
]
