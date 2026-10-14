import { useQuery } from '@tanstack/react-query'
import { getDeals } from '../api/cheapshark.ts'
import type { Deal, DealsQuery } from '../api/types.ts'

const SOURCES: DealsQuery[] = [
  { sortBy: 'Reviews', pageSize: 60, pageNumber: 0 },
  { sortBy: 'Reviews', pageSize: 60, pageNumber: 1 },
  { sortBy: 'Reviews', pageSize: 60, pageNumber: 0, AAA: 1 },
]

const LIMIT = 20

export function pickPopular (deals: Deal[], limit = LIMIT): Deal[] {
  const byGame = new Map<string, Deal>()
  for (const deal of deals) {
    const key = deal.steamAppId ?? `game:${deal.gameId}`
    const current = byGame.get(key)
    if (!current || deal.salePrice < current.salePrice) byGame.set(key, deal)
  }
  return [...byGame.values()]
    .sort((a, b) => b.steamRatingCount - a.steamRatingCount)
    .slice(0, limit)
}

export function usePopularGames () {
  return useQuery({
    queryKey: ['popular'],
    queryFn: async ({ signal }) => {
      const results = await Promise.allSettled(SOURCES.map(q => getDeals(q, signal)))
      const pages = results.filter(r => r.status === 'fulfilled').map(r => r.value)
      if (pages.length === 0) throw (results[0] as PromiseRejectedResult).reason
      return pickPopular(pages.flatMap(p => p.deals))
    },
  })
}
