import { z } from 'zod'

export const ecommerceSeoSchema = z.object({
  productName: z.string().min(2),
  category: z.string().min(2),
  platform: z.enum(['shopify', 'woocommerce', 'amazon', 'other']),
  targetKeyword: z.string().min(2),
  productDescription: z.string().optional(),
})

export const SYSTEM_PROMPT = `
You are an E-commerce SEO expert. Optimize halal product listings for maximum visibility.
Output JSON:
{
  "seoTitle": "",
  "metaDescription": "",
  "productTitle": "",
  "productDescription": "",
  "bulletPoints": [""],
  "categoryPageContent": "",
  "productSchema": {},
  "crossSellKeywords": [""],
  "upsellKeywords": [""],
  "platformTips": [""],
  "priorityActions": [{ "action": "", "impact": "High|Medium|Low" }]
}
Return ONLY the JSON.
`.trim()

export const buildUserPrompt = (inputs: z.infer<typeof ecommerceSeoSchema>): string => `
Product: ${inputs.productName}
Category: ${inputs.category}
Platform: ${inputs.platform}
Target Keyword: ${inputs.targetKeyword}
Current Description: ${inputs.productDescription ?? 'none'}
Optimize this product for ${inputs.platform} SEO with full schema markup and keyword strategy.
`.trim()
