import { useQuery } from '@tanstack/react-query'
import { getDealDetails, getGame } from '../api/cheapshark.ts'

export function useGame (gameId: string | undefined) {
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: ({ signal }) => getGame(gameId!, signal),
    enabled: Boolean(gameId),
  })
}

export function useDealDetails (dealId: string | undefined) {
  return useQuery({
    queryKey: ['deal', dealId],
    queryFn: ({ signal }) => getDealDetails(dealId!, signal),
    enabled: Boolean(dealId),
  })
}
