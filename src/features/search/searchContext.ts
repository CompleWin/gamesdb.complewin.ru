import { createContext, useContext } from 'react'

export interface SearchOverlayApi {
  isOpen: boolean
  open: () => void
  close: (options?: { restoreFocus?: boolean }) => void
}

export const SearchContext = createContext<SearchOverlayApi | null>(null)

export function useSearchOverlay (): SearchOverlayApi {
  const api = useContext(SearchContext)
  if (!api) throw new Error('useSearchOverlay вызван вне SearchProvider')
  return api
}

export function isTyping (target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable
}

export function isSearchKey (event: KeyboardEvent): boolean {
  return event.code === 'Slash' || event.key === '/'
}
