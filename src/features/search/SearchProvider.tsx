import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SearchContext, isSearchKey, isTyping, type SearchOverlayApi } from './searchContext.ts'
import { SearchOverlay } from './SearchOverlay.tsx'

export function SearchProvider ({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const opener = useRef<HTMLElement | null>(null)

  const open = useCallback(() => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setIsOpen(true)
  }, [])

  const close = useCallback((options?: { restoreFocus?: boolean }) => {
    setIsOpen(false)
    if (options?.restoreFocus) opener.current?.focus()
    opener.current = null
  }, [])

  useEffect(() => {
    function onKeyDown (event: KeyboardEvent) {
      if (isOpen) return
      if (!isSearchKey(event) || event.ctrlKey || event.altKey || event.metaKey || isTyping(event.target)) return
      event.preventDefault()
      open()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, open])

  const api = useMemo<SearchOverlayApi>(() => ({ isOpen, open, close }), [isOpen, open, close])

  return (
    <SearchContext.Provider value={api}>
      {children}
      {isOpen && <SearchOverlay onClose={close} />}
    </SearchContext.Provider>
  )
}
