import { Search } from 'lucide-react'
import { iconButtonClass } from '../../components/ui/button.ts'
import { cx } from '../../lib/cx.ts'
import { useSearchOverlay } from './searchContext.ts'

function Kbd ({ className }: { className?: string }) {
  return (
    <kbd
      className={cx(
        'flex size-[22px] shrink-0 items-center justify-center rounded-md border pb-px font-primary text-[13px] leading-none',
        className,
      )}
    >
      /
    </kbd>
  )
}

export function HeaderSearchButton () {
  const { open } = useSearchOverlay()
  return (
    <>
      <button
        type="button"
        onClick={open}
        title="Поиск игр"
        className={cx(
          'hidden h-9 w-[200px] cursor-pointer items-center gap-2.5 rounded-full bg-white/16 pl-3.5 pr-2.5 text-white',
          'transition-colors hover:bg-white/28 md:flex',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
        )}
      >
        <Search size={15} className="shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 text-left text-sm text-white/85">Поиск</span>
        <Kbd className="border-white/40 text-white/75" />
      </button>
      <button type="button" onClick={open} aria-label="Поиск игр" title="Поиск игр" className={iconButtonClass('white', 'md:hidden')}>
        <Search size={21} aria-hidden="true" />
      </button>
    </>
  )
}

export function HeroSearchButton () {
  const { open } = useSearchOverlay()
  return (
    <button
      type="button"
      onClick={open}
      className={cx(
        'group flex h-14 w-full cursor-pointer items-center gap-3 rounded-full border-2 border-primary bg-surface-island',
        'px-5 text-left transition-colors hover:bg-primary-soft md:h-16 md:gap-4 md:px-7',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      )}
    >
      <Search size={22} className="shrink-0 text-primary" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-base text-fg-faint md:text-lg">
        Найти игру<span className="hidden sm:inline">: Hades, Portal 2, The Witcher 3…</span>
      </span>
      <Kbd className="hidden border-line-strong text-fg-subtle md:flex" />
    </button>
  )
}
