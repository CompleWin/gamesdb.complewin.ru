import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Search, X } from 'lucide-react'
import { searchGames } from '../../api/cheapshark.ts'
import { errorMessage } from '../../api/client.ts'
import { GameImage } from '../../components/game/GameImage.tsx'
import { buttonClass, chipClass, iconButtonClass } from '../../components/ui/button.ts'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.ts'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.ts'
import { cx, FOCUS_RING } from '../../lib/cx.ts'
import { formatPrice } from '../../lib/format.ts'
import { searchHref } from '../../lib/searchParams.ts'
import { QUICK_TAGS, findTag } from '../../lib/tags.ts'

const MIN_QUERY = 2
const LIMIT = 10

interface SearchOverlayProps {
  onClose: (options?: { restoreFocus?: boolean }) => void
}

export function SearchOverlay ({ onClose }: SearchOverlayProps) {
  const navigate = useNavigate()
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  const [query, setQuery] = useState('')
  const term = useDebouncedValue(query.trim(), 300)
  const enabled = term.length >= MIN_QUERY

  const { data: results = [], isFetching, isError, error, refetch } = useQuery({
    queryKey: ['game-search', term],
    queryFn: ({ signal }) => searchGames(term, LIMIT, signal),
    enabled,
  })

  const [active, setActive] = useState({ term: '', index: 0 })
  const activeIndex = active.term === term ? active.index : 0

  useBodyScrollLock(true)

  useEffect(() => {
    input.current?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose({ restoreFocus: true })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    list.current?.querySelectorAll('[data-result]')[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const trimmed = query.trim()
  const allResultsHref = searchHref({ title: trimmed })

  function go (href: string) {
    onClose()
    void navigate(href)
  }

  function onInputKeyDown (event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (results.length === 0) return
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive({ term, index: (activeIndex + step + results.length) % results.length })
      return
    }
    if (event.key !== 'Enter') return
    event.preventDefault()
    const picked = results[activeIndex]
    if (!event.ctrlKey && !event.metaKey && picked && term === trimmed) go(`/game/${picked.gameId}`)
    else if (trimmed) go(allResultsHref)
  }

  const pending = enabled && isFetching && results.length === 0
  const showHint = !enabled && !pending
  const showEmpty = enabled && !isFetching && !isError && results.length === 0

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[color-mix(in_srgb,var(--color-fg)_55%,transparent)] md:px-8 md:py-10"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose({ restoreFocus: true }) }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Поиск игр"
        className={cx(
          'flex h-full w-full flex-col overflow-hidden bg-surface-island',
          'md:h-auto md:max-h-full md:w-[min(880px,100%)] md:rounded-island md:border md:border-line md:shadow-modal',
        )}
      >
        <div className="flex items-center gap-3 py-2 pl-4 pr-2 md:px-[22px] md:py-4">
          <Search size={20} className="shrink-0 text-primary" aria-hidden="true" />
          <input
            ref={input}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="Название игры: Hades, Portal 2, Witcher…"
            aria-label="Название игры"
            role="combobox"
            aria-expanded={enabled && results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[activeIndex] ? `search-result-${activeIndex}` : undefined}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-lg text-fg outline-none placeholder:text-fg-faint md:text-xl"
          />
          <button
            type="button"
            onClick={() => onClose({ restoreFocus: true })}
            title="Закрыть поиск"
            className={cx(
              'hidden shrink-0 cursor-pointer rounded-full border border-line px-2.5 py-1.5 text-[11px] leading-none',
              'tracking-[0.08em] uppercase text-fg-subtle transition-colors hover:border-fg hover:text-fg md:inline-flex',
              FOCUS_RING,
            )}
          >
            Esc
          </button>
          <button type="button" onClick={() => onClose({ restoreFocus: true })} aria-label="Закрыть поиск" className={iconButtonClass('default', 'md:hidden')}>
            <X size={21} aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto border-t border-line bg-surface-page p-2.5 md:max-h-[60vh] md:min-h-[240px]">
          {showHint && (
            <div className="flex flex-col gap-4 px-2 py-5">
              <p className="text-sm text-fg-subtle">
                Начните вводить название — подсказки появятся сразу. Или откройте подборку:
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map(id => (
                  <Link key={id} to={searchHref({ tags: [id] })} onClick={() => onClose()} className={chipClass(false, 'sm')}>
                    {findTag(id)?.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {pending && <p className="px-2 py-5 text-center text-sm text-fg-subtle">Ищем…</p>}

          {isError && results.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="text-sm text-danger-ink">{errorMessage(error)}</span>
              <button type="button" className={buttonClass({ variant: 'outline', color: 'gray', size: 'sm' })} onClick={() => void refetch()}>
                Повторить
              </button>
            </div>
          )}

          {showEmpty && (
            <p className="px-2 py-5 text-center text-sm text-fg-subtle">
              Ничего не найдено по «{term}». Попробуйте короче или на английском.
            </p>
          )}

          {enabled && results.length > 0 && (
            <ul ref={list} id="search-results" role="listbox" aria-label="Результаты" className="flex flex-col gap-2">
              {results.map((game, index) => (
                <li key={game.gameId} data-result id={`search-result-${index}`} role="option" aria-selected={index === activeIndex}>
                  <Link
                    to={`/game/${game.gameId}`}
                    onClick={() => onClose()}
                    onMouseEnter={() => setActive({ term, index })}
                    className={cx(
                      'flex items-center gap-3 rounded-panel border px-2.5 py-2 no-underline transition-colors md:gap-4 md:px-3',
                      index === activeIndex ? 'border-primary bg-primary-soft' : 'border-line bg-surface-island',
                      FOCUS_RING,
                    )}
                  >
                    <GameImage
                      steamAppId={game.steamAppId}
                      thumb={game.thumb}
                      alt=""
                      className="aspect-[460/215] w-[92px] shrink-0 rounded-[10px] md:w-[120px]"
                    />
                    <span className="min-w-0 flex-1 text-[15px] font-extrabold leading-tight text-fg line-clamp-2">
                      {game.title}
                    </span>
                    <span className="shrink-0 text-right text-[13px] text-fg-subtle">
                      <span className="hidden sm:inline">от </span>
                      <span className="text-[15px] font-extrabold tabular-nums text-fg">{formatPrice(game.cheapest)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2.5 md:px-5">
          {trimmed
            ? (
              <Link
                to={allResultsHref}
                onClick={() => onClose()}
                className={cx('inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-primary-ink hover:text-primary md:min-h-0', FOCUS_RING)}
              >
                Все результаты по «{trimmed}»
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              )
            : <span />}
          <span className="hidden whitespace-nowrap text-xs text-fg-subtle md:inline">
            ↑ ↓ — выбор · ↵ — открыть · Ctrl+↵ — все результаты · Esc — закрыть
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
