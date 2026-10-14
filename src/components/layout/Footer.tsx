import { FOCUS_RING, cx } from '../../lib/cx.ts'
import { SITE_TITLE } from '../../lib/site.ts'

export function Footer () {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-baseline justify-between gap-x-5 gap-y-3 px-4 py-9 text-xs tracking-[0.06em] text-fg-faint md:px-8">
        <span>&copy; {year} {SITE_TITLE} &middot; Сравнение цен на игры</span>
        <span>
          Данные:{' '}
          <a
            href="https://www.cheapshark.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={cx('text-fg-subtle underline underline-offset-4 transition-colors hover:text-primary', FOCUS_RING)}
          >
            CheapShark API
          </a>
          {' '}&middot; цены в долларах США
        </span>
      </div>
    </footer>
  )
}
