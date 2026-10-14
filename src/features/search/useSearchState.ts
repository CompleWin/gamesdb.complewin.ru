import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { readSearch, writeSearch, type SearchState } from '../../lib/searchParams.ts'

export function useSearchState (): [SearchState, (patch: Partial<SearchState>) => void] {
  const [params, setParams] = useSearchParams()
  const state = useMemo(() => readSearch(params), [params])

  const update = useCallback((patch: Partial<SearchState>) => {
    const next: SearchState = { ...state, pageIndex: 0, ...patch }
    setParams(writeSearch(next))
  }, [state, setParams])

  return [state, update]
}
