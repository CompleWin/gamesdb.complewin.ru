import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStores } from '../api/cheapshark.ts'
import type { Store } from '../api/types.ts'

export function useStores () {
  return useQuery({
    queryKey: ['stores'],
    queryFn: ({ signal }) => getStores(signal),
    staleTime: Infinity,
  })
}

export function useStoreMap (): Map<string, Store> {
  const { data } = useStores()
  return useMemo(() => new Map((data ?? []).map(s => [s.storeId, s])), [data])
}

export function useActiveStores (): Store[] {
  const { data } = useStores()
  return useMemo(
    () => (data ?? []).filter(s => s.isActive).sort((a, b) => Number(a.storeId) - Number(b.storeId)),
    [data],
  )
}
