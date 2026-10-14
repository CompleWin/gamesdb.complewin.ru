import { Link, NavLink, useLocation } from 'react-router'
import { HeaderSearchButton } from '../../features/search/SearchTriggers.tsx'
import { cx } from '../../lib/cx.ts'
import { SITE_TITLE } from '../../lib/site.ts'

const NAV_ITEMS = [
  { to: '/search', label: 'Поиск' },
  { to: '/analytics', label: 'Аналитика' },
]

function navClass ({ isActive }: { isActive: boolean }) {
  return cx(
    'inline-flex min-h-11 items-center border-b-2 pt-1 pb-0.5 text-xs tracking-[0.12em] uppercase text-white no-underline',
    'transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:min-h-0',
    isActive ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100',
  )
}

function Nav ({ className }: { className?: string }) {
  return (
    <div className={cx('flex items-center gap-x-5', className)}>
      {NAV_ITEMS.map(item => <NavLink key={item.to} to={item.to} className={navClass}>{item.label}</NavLink>)}
    </div>
  )
}

export function Header () {
  const isHome = useLocation().pathname === '/'

  return (
    <header className="relative z-20 bg-primary text-white">
      <nav aria-label="Основная навигация" className="mx-auto max-w-[1280px] px-4 md:px-8">
        <div className="flex min-h-[60px] items-center justify-between gap-6 py-2 md:min-h-16">
          <div className="flex min-w-0 items-center gap-x-8">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center whitespace-nowrap text-[20px] font-extrabold tracking-[-0.02em] text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:text-[22px]"
            >
              {SITE_TITLE}
            </Link>
            <Nav className="hidden md:flex" />
          </div>
          {!isHome && <HeaderSearchButton />}
        </div>
        <Nav className="-mt-1 pb-1 md:hidden" />
      </nav>
    </header>
  )
}
