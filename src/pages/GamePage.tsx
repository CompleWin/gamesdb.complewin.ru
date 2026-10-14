import { useNavigate, useParams } from 'react-router'
import { Bar } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import { ArrowLeft, ExternalLink, TrendingDown } from 'lucide-react'
import { NotFoundError } from '../api/client.ts'
import { dealRedirectUrl } from '../api/normalize.ts'
import type { Game, GameOffer, Store } from '../api/types.ts'
import { GameImage } from '../components/game/GameImage.tsx'
import { DiscountBadge, PriceTag } from '../components/game/PriceTag.tsx'
import { StoreBadge } from '../components/game/StoreBadge.tsx'
import { ChartCard } from '../components/ui/ChartCard.tsx'
import { Island } from '../components/ui/Island.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
import { SkeletonBar, SkeletonBlock } from '../components/ui/Skeleton.tsx'
import { ErrorState } from '../components/ui/StateIsland.tsx'
import { buttonClass } from '../components/ui/button.ts'
import { useDealDetails, useGame } from '../hooks/useGame.ts'
import { useStoreMap } from '../hooks/useStores.ts'
import { BAR_STYLE, chartColors, money } from '../lib/charts.ts'
import { cx, FOCUS_RING } from '../lib/cx.ts'
import { formatCount, formatDate, formatPrice, steamRatingLabel } from '../lib/format.ts'
import { steamStoreUrl } from '../lib/images.ts'
import { NotFoundPage } from './NotFoundPage.tsx'

function OfferRow ({ offer, best }: { offer: GameOffer; best: boolean }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
      <div className="flex min-w-0 flex-1 basis-40 flex-col gap-1">
        <StoreBadge storeId={offer.storeId} className="text-base font-extrabold text-fg" />
        {best && <span className="text-[11px] tracking-[0.14em] uppercase text-primary-ink">Лучшая цена</span>}
      </div>
      <PriceTag price={offer.price} normalPrice={offer.retailPrice} savings={offer.savings} />
      <a
        href={dealRedirectUrl(offer.dealId)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass({ variant: 'outline', color: best ? 'primary' : 'gray', size: 'sm', className: 'w-full sm:w-auto' })}
      >
        В магазин
        <ExternalLink size={14} aria-hidden="true" />
        <span className="sr-only">(откроется в новой вкладке)</span>
      </a>
    </li>
  )
}

function PriceByStoreChart ({ offers, stores }: { offers: GameOffer[]; stores: Map<string, Store> }) {
  const labels = offers.map(o => stores.get(o.storeId)?.name ?? `#${o.storeId}`)
  const bestPrice = offers[0]?.price ?? 0

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    interaction: { mode: 'index', intersect: false, axis: 'y' },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => formatPrice(Number(ctx.parsed.x)) } },
    },
    scales: {
      x: { beginAtZero: true, grid: { color: chartColors.grid }, border: { display: false }, ticks: { callback: money } },
      y: { grid: { display: false }, border: { color: chartColors.grid } },
    },
  }

  return (
    <ChartCard
      title="Цена по магазинам"
      subtitle="Синим — самое дешёвое предложение, серым — остальные."
      height={Math.max(140, offers.length * 32 + 40)}
      table={{ columns: ['Магазин', 'Цена'], rows: offers.map((o, i) => ({ label: labels[i], value: formatPrice(o.price) })) }}
    >
      <Bar
        aria-label="Цена игры в разных магазинах"
        data={{
          labels,
          datasets: [{
            data: offers.map(o => o.price),
            ...BAR_STYLE,
            backgroundColor: offers.map(o => (o.price === bestPrice ? chartColors.primary : chartColors.muted)),
          }],
        }}
        options={options}
      />
    </ChartCard>
  )
}

function BestPriceAside ({ game }: { game: Game }) {
  const best = game.offersByPrice[0]
  const atRecord = best && best.price <= game.cheapestEver.price

  return (
    <Island as="aside" aria-label="Лучшая цена" className="flex flex-col gap-6 lg:sticky lg:top-5">
      {best && (
        <div className="flex flex-col gap-3">
          <SectionLabel as="h2">Лучшая цена сейчас</SectionLabel>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[44px] font-extrabold leading-none tracking-[-0.035em]">{formatPrice(best.price)}</span>
            {Math.round(best.savings) >= 1 && <DiscountBadge savings={best.savings} />}
          </div>
          {best.retailPrice > best.price && (
            <p className="text-sm text-fg-subtle">Обычно <s>{formatPrice(best.retailPrice)}</s></p>
          )}
          <StoreBadge storeId={best.storeId} className="text-sm font-semibold text-fg-muted" />
          <a
            href={dealRedirectUrl(best.dealId)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass({ size: 'lg', wide: true, className: 'whitespace-nowrap px-5' })}
          >
            Купить за {formatPrice(best.price)}
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-panel border border-line bg-surface-muted p-4">
        <SectionLabel as="h2">Исторический минимум</SectionLabel>
        <span className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em]">
          {formatPrice(game.cheapestEver.price)}
        </span>
        <span className="text-sm text-fg-subtle">{formatDate(game.cheapestEver.date)}</span>
        {atRecord && (
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-success-hover">
            <TrendingDown size={15} aria-hidden="true" />
            Сейчас цена на минимуме
          </span>
        )}
      </div>

      {game.steamAppId && (
        <a
          href={steamStoreUrl(game.steamAppId)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass({ variant: 'ghost', color: 'primary', size: 'sm', className: 'self-start' })}
        >
          Страница в Steam
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      )}
    </Island>
  )
}

function GameSkeleton () {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
      <Island className="flex flex-col gap-5">
        <SkeletonBlock className="aspect-[460/215] w-full max-w-[460px] rounded-panel" />
        <SkeletonBar className="h-9 w-[60%]" />
        <SkeletonBar className="w-[40%]" />
        <SkeletonBar className="mt-4 w-full" />
        <SkeletonBar className="w-full" />
      </Island>
      <Island className="flex flex-col gap-4">
        <SkeletonBar className="w-[50%]" />
        <SkeletonBar className="h-10 w-[60%]" />
        <SkeletonBar className="h-12 w-full" />
      </Island>
    </div>
  )
}

export function GamePage () {
  const { gameId } = useParams()
  const game = useGame(gameId)
  const details = useDealDetails(game.data?.offersByPrice[0]?.dealId)
  const stores = useStoreMap()
  const navigate = useNavigate()

  function goBack () {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) void navigate(-1)
    else void navigate('/')
  }

  if (game.isPending) return <GameSkeleton />
  if (game.error instanceof NotFoundError) return <NotFoundPage />
  if (game.isError) return <ErrorState error={game.error} onRetry={() => void game.refetch()} />

  const { data } = game
  const info = details.data
  const meta = [
    info?.publisher,
    info?.releaseDate && `Выход: ${formatDate(info.releaseDate)}`,
    info && info.metacritic > 0 && `Metacritic ${info.metacritic}`,
    info && info.steamRatingCount > 0 &&
      `Steam: ${steamRatingLabel(info.steamRatingText).toLowerCase()}, ${info.steamRatingPercent}% из ${formatCount(info.steamRatingCount)}`,
  ].filter(Boolean) as string[]

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={goBack}
        className={cx('inline-flex min-h-11 w-fit cursor-pointer items-center gap-1.5 rounded-full text-sm text-fg-subtle hover:text-primary md:min-h-0', FOCUS_RING)}
      >
        <ArrowLeft size={15} aria-hidden="true" /> Назад
      </button>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Island className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <GameImage
                steamAppId={data.steamAppId}
                thumb={data.thumb}
                alt={data.title}
                eager
                className="aspect-[460/215] w-full shrink-0 rounded-panel md:w-[340px]"
              />
              <div className="flex min-w-0 flex-col gap-3">
                <SectionLabel as="p">Игра · #{data.gameId}</SectionLabel>
                <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.035em] md:text-[44px]">{data.title}</h1>
                {meta.length > 0 && <p className="text-sm leading-[1.6] text-fg-subtle">{meta.join(' · ')}</p>}
                {info?.steamworks && (
                  <span className="inline-flex h-[26px] w-fit items-center rounded-full bg-primary-soft px-3 text-[10.5px] font-bold tracking-[0.14em] uppercase text-primary-ink">
                    Steamworks
                  </span>
                )}
              </div>
            </div>

            <div>
              <SectionLabel>Предложения · {data.offersByPrice.length}</SectionLabel>
              <ul className="mt-1 divide-y divide-line">
                {data.offersByPrice.map((offer, i) => <OfferRow key={offer.dealId} offer={offer} best={i === 0} />)}
              </ul>
            </div>
          </Island>

          {data.offersByPrice.length >= 2 && <PriceByStoreChart offers={data.offersByPrice} stores={stores} />}
        </div>

        <BestPriceAside game={data} />
      </div>
    </div>
  )
}
