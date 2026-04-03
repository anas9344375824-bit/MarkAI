export const countWords = (text: string): number =>
  text.trim().split(/\s+/).filter(Boolean).length

export const estimateTokens = (text: string): number =>
  Math.ceil(text.length / 4)

export const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const sanitizeHtml = (input: string): string =>
  input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
       .replace(/on\w+="[^"]*"/gi, '')
       .replace(/javascript:/gi, '')

export const truncate = (str: string, maxLen: number): string =>
  str.length > maxLen ? str.slice(0, maxLen - 3) + '...' : str

export const runWithConcurrency = async <T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<PromiseSettledResult<T>[]> => {
  const results: PromiseSettledResult<T>[] = []
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency).map(t => t())
    const batchResults = await Promise.allSettled(batch)
    results.push(...batchResults)
  }
  return results
}

export const parseJsonSafe = <T>(raw: string): T | null => {
  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned) as T
  } catch {
    return null
  }
}
