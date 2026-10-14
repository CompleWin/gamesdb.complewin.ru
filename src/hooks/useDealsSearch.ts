import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDeals } from '../api/cheapshark.ts'
import { toDealsQuery, type SearchState } from '../lib/searchParams.ts'

export function useDealsSearch (state: SearchState) {
  const query = toDealsQuery(state)
  return useQuery({
    queryKey: ['deals', query],
    queryFn: ({ signal }) => getDeals(query, signal),
    placeholderData: keepPreviousData,
  })
}
