export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
