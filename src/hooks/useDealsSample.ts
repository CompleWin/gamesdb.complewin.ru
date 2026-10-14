import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDeals } from '../api/cheapshark.ts'
import type { Deal } from '../api/types.ts'

export type SampleMode = 'recent' | 'best'

const PAGES = 5
const PAGE_SIZE = 60

export function useDealsSample (mode: SampleMode, storeId: string | null) {
  return useQuery({
    queryKey: ['deals-sample', mode, storeId],
    queryFn: async ({ signal }) => {
      const deals: Deal[] = []
      for (let page = 0; page < PAGES; page++) {
        try {
          const result = await getDeals({
            onSale: 1,
            sortBy: mode === 'recent' ? 'Recent' : 'Deal Rating',
            storeID: storeId ?? undefined,
            pageNumber: page,
            pageSize: PAGE_SIZE,
          }, signal)
          deals.push(...result.deals)
          if (page + 1 >= result.totalPages || result.deals.length < PAGE_SIZE) break
        } catch (error) {
          if (deals.length === 0) throw error
          break
        }
      }
      return deals
    },
    placeholderData: keepPreviousData,
  })
}
