import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { GameCard, GameCardSkeleton, GRID_CLASSES } from '../components/game/GameCard.tsx'
import { Island } from '../components/ui/Island.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
import { ErrorState } from '../components/ui/StateIsland.tsx'
import { chipClass } from '../components/ui/button.ts'
import { HeroSearchButton } from '../features/search/SearchTriggers.tsx'
import { usePopularGames } from '../hooks/usePopularGames.ts'
import { cx, FOCUS_RING } from '../lib/cx.ts'
import { searchHref } from '../lib/searchParams.ts'
import { QUICK_TAGS, findTag } from '../lib/tags.ts'

const SKELETON_COUNT = 10

export function HomePage () {
  const popular = usePopularGames()

  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <Island className="px-4.5 py-8 md:px-10 md:py-14">
        <div className="mx-auto flex max-w-190 flex-col items-center text-center">
          <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.035em] md:text-[44px]">
            Скидки на игры во всех магазинах
          </h1>
          <p className="mt-4 max-w-[54ch] text-base leading-[1.6] text-fg-muted md:text-lg md:leading-[1.65]">
            Steam, GOG, Humble, Fanatical и ещё два десятка магазинов в одном поиске.
            Сравнивайте цены и забирайте игру там, где дешевле.
          </p>
          <div className="mt-7 w-full md:mt-9">
            <HeroSearchButton />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {QUICK_TAGS.map(id => (
              <Link key={id} to={searchHref({ tags: [id] })} className={chipClass(false, 'sm')}>
                {findTag(id)?.label}
              </Link>
            ))}
          </div>
        </div>
      </Island>

      <section aria-labelledby="popular-title" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <SectionLabel id="popular-title">Популярное · больше всего отзывов в Steam</SectionLabel>
          <Link
            to={searchHref({ sort: 'reviews' })}
            className={cx('inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full text-sm text-primary-ink hover:text-primary md:min-h-0', FOCUS_RING)}
          >
            Все <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {popular.isError
          ? <ErrorState error={popular.error} onRetry={() => void popular.refetch()} />
          : (
            <ul className={GRID_CLASSES} aria-busy={popular.isPending}>
              {popular.isPending
                ? Array.from({ length: SKELETON_COUNT }, (_, i) => <li key={i}><GameCardSkeleton /></li>)
                : popular.data.map((deal, i) => (
                  <li key={deal.dealId} className="flex">
                    <GameCard deal={deal} eager={i < 5} />
                  </li>
                ))}
            </ul>
            )}
      </section>
    </div>
  )
}
