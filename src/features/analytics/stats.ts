import type { Deal } from '../../api/types.ts'

export interface Bucket {
  label: string
  value: number
}

function mean (values: number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
}

function median (values: number[]): number {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

const round1 = (n: number) => Math.round(n * 10) / 10

export interface Kpis {
  count: number
  gameCount: number
  avgSavings: number
  medianPrice: number
  totalSaved: number
  deepShare: number
}

export function kpis (deals: Deal[]): Kpis {
  return {
    count: deals.length,
    gameCount: new Set(deals.map(d => d.gameId)).size,
    avgSavings: mean(deals.map(d => d.savings)),
    medianPrice: median(deals.map(d => d.salePrice)),
    totalSaved: deals.reduce((sum, d) => sum + Math.max(0, d.normalPrice - d.salePrice), 0),
    deepShare: deals.length ? deals.filter(d => d.savings >= 75).length / deals.length : 0,
  }
}

export interface StoreStat {
  storeId: string
  count: number
  avgSavings: number
}

export function byStore (deals: Deal[]): StoreStat[] {
  const groups = new Map<string, Deal[]>()
  for (const d of deals) groups.set(d.storeId, [...(groups.get(d.storeId) ?? []), d])
  return [...groups.entries()]
    .map(([storeId, list]) => ({ storeId, count: list.length, avgSavings: round1(mean(list.map(d => d.savings))) }))
    .sort((a, b) => b.count - a.count)
}

export function discountHistogram (deals: Deal[]): Bucket[] {
  const counts = Array.from({ length: 10 }, () => 0)
  for (const d of deals) counts[Math.min(9, Math.floor(d.savings / 10))]++
  return counts.map((value, i) => ({ label: `${i * 10}–${i * 10 + 10}%`, value }))
}

const PRICE_EDGES = [0, 5, 10, 20, 30, 50]

export function priceHistogram (deals: Deal[]): Bucket[] {
  const counts = PRICE_EDGES.map(() => 0)
  for (const d of deals) {
    let i = PRICE_EDGES.length - 1
    while (i > 0 && d.salePrice < PRICE_EDGES[i]) i--
    counts[i]++
  }
  return counts.map((value, i) => {
    const from = PRICE_EDGES[i]
    const to = PRICE_EDGES[i + 1]
    return { label: to === undefined ? `$${from}+` : `$${from}–${to}`, value }
  })
}

export interface TimelinePoint {
  label: string
  count: number
  avgSavings: number | null
}

export interface Timeline {
  unit: 'hour' | 'day'
  points: TimelinePoint[]
}

const HOUR = 3600 * 1000
const DAY = 24 * HOUR

const hourFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

export function timeline (deals: Deal[], maxPoints = 24): Timeline {
  const stamps = deals.map(d => d.lastChange?.getTime()).filter((t): t is number => t !== undefined)
  if (stamps.length === 0) return { unit: 'hour', points: [] }

  const last = Math.max(...stamps)
  const first = Math.min(...stamps)
  const unit = last - first <= 2 * DAY ? 'hour' : 'day'
  const step = unit === 'hour' ? HOUR : DAY

  const floor = (t: number) => {
    const date = new Date(t)
    if (unit === 'hour') date.setMinutes(0, 0, 0)
    else date.setHours(0, 0, 0, 0)
    return date.getTime()
  }

  const end = floor(last)
  const start = Math.max(floor(first), end - (maxPoints - 1) * step)
  const slots = new Map<number, number[]>()
  for (let t = start; t <= end; t += step) slots.set(t, [])

  for (const d of deals) {
    const t = d.lastChange && floor(d.lastChange.getTime())
    if (t && slots.has(t)) slots.get(t)!.push(d.savings)
  }

  const format = unit === 'hour' ? hourFormat : dayFormat
  return {
    unit,
    points: [...slots.entries()].map(([t, savings]) => ({
      label: format.format(t).replace('.', ''),
      count: savings.length,
      avgSavings: savings.length ? round1(mean(savings)) : null,
    })),
  }
}

export interface YearPoint {
  label: string
  value: number | null
}

export function savingsByYear (deals: Deal[], minCount = 3): YearPoint[] {
  const groups = new Map<number, number[]>()
  for (const d of deals) {
    if (!d.releaseDate) continue
    const year = d.releaseDate.getFullYear()
    groups.set(year, [...(groups.get(year) ?? []), d.savings])
  }
  const years = [...groups.entries()].filter(([, list]) => list.length >= minCount).map(([year]) => year)
  if (years.length === 0) return []

  const points: YearPoint[] = []
  for (let year = Math.min(...years); year <= Math.max(...years); year++) {
    const list = groups.get(year)
    points.push({ label: String(year), value: list && list.length >= minCount ? round1(mean(list)) : null })
  }
  return points
}

export function undatedShare (deals: Deal[]): number {
  return deals.length ? deals.filter(d => !d.releaseDate).length / deals.length : 0
}
