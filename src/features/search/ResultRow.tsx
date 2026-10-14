import { Link } from 'react-router'
import { ExternalLink } from 'lucide-react'
import { dealRedirectUrl } from '../../api/normalize.ts'
import type { Deal } from '../../api/types.ts'
import { GameImage } from '../../components/game/GameImage.tsx'
import { PriceTag } from '../../components/game/PriceTag.tsx'
import { StoreBadge } from '../../components/game/StoreBadge.tsx'
import { buttonClass } from '../../components/ui/button.ts'
import { SkeletonBar, SkeletonBlock } from '../../components/ui/Skeleton.tsx'
import { cx, FOCUS_RING } from '../../lib/cx.ts'
import { formatCount, formatDate, pluralize, steamRatingLabel } from '../../lib/format.ts'

function MetaDot () {
  return <span aria-hidden="true" className="text-fg-disabled">·</span>
}

export function ResultRow ({ deal }: { deal: Deal }) {
  const gameHref = `/game/${deal.gameId}`

  return (
    <li className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-3 px-4 py-4 md:grid-cols-[136px_1fr_auto] md:items-center md:gap-x-5 md:px-6">
      <Link to={gameHref} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-[10px]">
        <GameImage steamAppId={deal.steamAppId} thumb={deal.thumb} alt="" className="aspect-[460/215] w-full" />
      </Link>

      <div className="flex min-w-0 flex-col gap-1.5">
        <Link
          to={gameHref}
          className={cx('line-clamp-2 rounded-sm text-base font-extrabold leading-tight tracking-[-0.01em] text-fg no-underline hover:text-primary-ink', FOCUS_RING)}
        >
          {deal.title}
        </Link>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-fg-subtle">
          <StoreBadge storeId={deal.storeId} className="font-semibold text-fg-muted" />
          {deal.metacritic > 0 && <><MetaDot /><span title="Оценка критиков Metacritic">Metacritic {deal.metacritic}</span></>}
          {deal.steamRatingCount > 0 && (
            <>
              <MetaDot />
              <span title={`${steamRatingLabel(deal.steamRatingText)} · ${formatCount(deal.steamRatingCount)} ${pluralize(deal.steamRatingCount, ['отзыв', 'отзыва', 'отзывов'])}`}>
                Steam {deal.steamRatingPercent}%
              </span>
            </>
          )}
          {deal.releaseDate && <><MetaDot /><span>{formatDate(deal.releaseDate)}</span></>}
        </div>
      </div>

      <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 md:col-span-1 md:flex-col md:items-end md:gap-2">
        <PriceTag price={deal.salePrice} normalPrice={deal.normalPrice} savings={deal.savings} />
        <a
          href={dealRedirectUrl(deal.dealId)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass({ variant: 'outline', color: 'primary', size: 'sm', className: 'w-full sm:w-auto' })}
        >
          В магазин
          <ExternalLink size={14} aria-hidden="true" />
          <span className="sr-only">(откроется в новой вкладке)</span>
        </a>
      </div>
    </li>
  )
}

export function ResultRowSkeleton () {
  return (
    <li className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-3 px-4 py-4 md:grid-cols-[136px_1fr_auto] md:items-center md:gap-x-5 md:px-6">
      <SkeletonBlock className="aspect-[460/215] w-full rounded-[10px]" />
      <div className="flex flex-col gap-2.5">
        <SkeletonBar className="w-[70%]" />
        <SkeletonBar className="w-[45%]" />
      </div>
      <SkeletonBar className="col-span-2 h-[38px] w-full md:col-span-1 md:w-[120px]" />
    </li>
  )
}
