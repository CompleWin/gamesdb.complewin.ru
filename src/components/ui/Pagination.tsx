import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx, FOCUS_RING } from '../../lib/cx.ts'

interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
  disabled?: boolean
}

const WINDOW = 7

function pageItems (page: number, count: number): (number | '…')[] {
  if (count <= WINDOW) return Array.from({ length: count }, (_, i) => i + 1)
  const left = Math.max(2, page - 1)
  const right = Math.min(count - 1, page + 1)
  const items: (number | '…')[] = [1]
  if (left > 2) items.push('…')
  for (let i = left; i <= right; i++) items.push(i)
  if (right < count - 1) items.push('…')
  items.push(count)
  return items
}

const NAV = cx(
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line md:size-9',
  'bg-surface-island text-fg-muted transition-colors hover:border-primary hover:text-primary',
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:text-fg-muted',
  FOCUS_RING,
)

export function Pagination ({ page, pageCount, onChange, disabled = false }: PaginationProps) {
  if (pageCount <= 1) return null

  function go (target: number) {
    if (disabled || target < 1 || target > pageCount || target === page) return
    onChange(target)
  }

  return (
    <nav aria-label="Пагинация" className="flex flex-wrap items-center justify-center gap-1">
      <button type="button" className={NAV} disabled={disabled || page <= 1} aria-label="Предыдущая страница" onClick={() => go(page - 1)}>
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {pageItems(page, pageCount).map((item, i) => item === '…'
        ? <span key={`gap-${i}`} className="select-none px-1.5 text-fg-faint">…</span>
        : (
          <button
            key={item}
            type="button"
            disabled={disabled}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => go(item)}
            className={cx(
              'inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border px-2 text-sm transition-colors md:h-9 md:min-w-9',
              item === page
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-surface-island text-fg-muted hover:border-primary hover:text-primary',
              FOCUS_RING,
            )}
          >
            {item}
          </button>
        ))}

      <button type="button" className={NAV} disabled={disabled || page >= pageCount} aria-label="Следующая страница" onClick={() => go(page + 1)}>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  )
}
