import { Link } from 'react-router'
import type { Deal } from '../../api/types.ts'
import { cx, FOCUS_RING } from '../../lib/cx.ts'
import { SkeletonBar, SkeletonBlock } from '../ui/Skeleton.tsx'
import { GameImage } from './GameImage.tsx'
import { PriceTag } from './PriceTag.tsx'

export function GameCard ({ deal, eager = false }: { deal: Deal; eager?: boolean }) {
  return (
    <Link
      to={`/game/${deal.gameId}`}
      className={cx(
        'group flex w-full flex-col overflow-hidden rounded-island border border-line bg-surface-island',
        'no-underline transition-colors hover:border-primary',
        FOCUS_RING,
      )}
    >
      <GameImage
        steamAppId={deal.steamAppId}
        thumb={deal.thumb}
        alt=""
        eager={eager}
        className="aspect-460/215 w-full"
      />
      <div className="flex flex-1 flex-col gap-2.5 p-3 md:p-4">
        <h3 className="line-clamp-2 text-[15px] font-extrabold leading-[1.2] tracking-[-0.01em] text-fg transition-colors group-hover:text-primary-ink md:text-base">
          {deal.title}
        </h3>
        <PriceTag
          className="mt-auto"
          price={deal.salePrice}
          normalPrice={deal.normalPrice}
          savings={deal.savings}
          size="sm"
        />
      </div>
    </Link>
  )
}

export function GameCardSkeleton () {
  return (
    <div className="flex flex-col overflow-hidden rounded-island border border-line bg-surface-island">
      <SkeletonBlock className="aspect-460/215 w-full" />
      <div className="flex flex-col gap-3 p-3 md:p-4">
        <SkeletonBar className="w-[85%]" />
        <SkeletonBar className="w-[45%]" />
      </div>
    </div>
  )
}

export const GRID_CLASSES = 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5'
