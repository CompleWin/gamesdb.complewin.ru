import { useMemo, useState } from 'react'
import { Store as StoreIcon } from 'lucide-react'
import { Chip } from '../components/ui/Chip.tsx'
import { Island } from '../components/ui/Island.tsx'
import { PillSelect } from '../components/ui/PillSelect.tsx'
import { SectionLabel } from '../components/ui/SectionLabel.tsx'
import { SkeletonBar } from '../components/ui/Skeleton.tsx'
import { EmptyState, ErrorState } from '../components/ui/StateIsland.tsx'
import {
  DiscountHistogram,
  PriceHistogram,
  PriceScatter,
  StoreCountChart,
  StoreSavingsChart,
  TimelineCountChart,
  TimelineSavingsChart,
  YearChart,
} from '../features/analytics/AnalyticsCharts.tsx'
import {
  byStore,
  discountHistogram,
  kpis,
  priceHistogram,
  savingsByYear,
  timeline,
  undatedShare,
} from '../features/analytics/stats.ts'
import { useDealsSample, type SampleMode } from '../hooks/useDealsSample.ts'
import { useActiveStores, useStoreMap } from '../hooks/useStores.ts'
import { cx } from '../lib/cx.ts'
import { formatCount, formatMoney, formatPrice } from '../lib/format.ts'

const MODES: { id: SampleMode; label: string; hint: string }[] = [
  { id: 'recent', label: 'Свежие', hint: 'Последние изменения цен' },
  { id: 'best', label: 'Лучшие', hint: 'Лучшие предложения по оценке CheapShark' },
]

const ALL_STORES = 'all'

function StatTile ({ label, value, note, className }: { label: string; value: string; note: string; className?: string }) {
  return (
    <Island padded={false} className={cx('flex flex-col gap-2 p-[18px] md:p-6', className)}>
      <span className="text-sm text-fg-subtle">{label}</span>
      <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em] md:text-[34px]">{value}</span>
      <span className="text-[13px] leading-[1.4] text-fg-faint">{note}</span>
    </Island>
  )
}

function StatTileSkeleton () {
  return (
    <Island padded={false} className="flex flex-col gap-3 p-[18px] md:p-6">
      <SkeletonBar className="w-[60%]" />
      <SkeletonBar className="h-8 w-[70%]" />
      <SkeletonBar className="w-[50%]" />
    </Island>
  )
}

export function AnalyticsPage () {
  const [mode, setMode] = useState<SampleMode>('recent')
  const [storeId, setStoreId] = useState<string>(ALL_STORES)
  const activeStores = useActiveStores()
  const storeMap = useStoreMap()

  const sample = useDealsSample(mode, storeId === ALL_STORES ? null : storeId)
  const deals = sample.data
  const dimmed = sample.isPlaceholderData

  const stats = useMemo(() => {
    if (!deals || deals.length === 0) return null
    return {
      kpi: kpis(deals),
      stores: byStore(deals),
      discounts: discountHistogram(deals),
      prices: priceHistogram(deals),
      timeline: timeline(deals),
      years: savingsByYear(deals),
      undated: undatedShare(deals),
    }
  }, [deals])

  const storeOptions = [
    { value: ALL_STORES, label: 'Все магазины' },
    ...activeStores.map(s => ({ value: s.storeId, label: s.name })),
  ]

  return (
    <div className="flex flex-col gap-5">
      <Island>
        <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.035em] md:text-[44px]">Аналитика скидок</h1>
        <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-fg-muted">
          Срез текущих скидок CheapShark: до 300 предложений, которые сейчас продаются со скидкой.
          Выборка обновляется раз в пять минут.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
          <SectionLabel as="span" className="w-full sm:w-auto">Выборка</SectionLabel>
          <div className="flex gap-2" role="group" aria-label="Выборка">
            {MODES.map(m => (
              <Chip key={m.id} active={mode === m.id} title={m.hint} onClick={() => setMode(m.id)}>
                {m.label}
              </Chip>
            ))}
          </div>
          <PillSelect
            label="Магазин"
            value={storeId}
            options={storeOptions}
            onChange={setStoreId}
            icon={<StoreIcon size={15} className="shrink-0" aria-hidden="true" />}
            className="w-full sm:w-auto"
          />
        </div>
      </Island>

      {sample.isError && !deals
        ? <ErrorState error={sample.error} onRetry={() => void sample.refetch()} />
        : sample.isPending
          ? (
            <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-5">
              {Array.from({ length: 5 }, (_, i) => <StatTileSkeleton key={i} />)}
            </div>
            )
          : !stats
              ? <EmptyState label="Пусто" title="В этом магазине сейчас нет скидок." />
              : (
                <>
                  <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-5" aria-live="polite">
                    <StatTile
                      label="Скидок в выборке"
                      value={formatCount(stats.kpi.count)}
                      note={`${formatCount(stats.kpi.gameCount)} разных игр`}
                    />
                    <StatTile label="Средняя скидка" value={`${Math.round(stats.kpi.avgSavings)}%`} note="по всем предложениям" />
                    <StatTile label="Медианная цена" value={formatPrice(stats.kpi.medianPrice)} note="половина игр дешевле" />
                    <StatTile
                      label="Экономия"
                      value={formatMoney(stats.kpi.totalSaved)}
                      note="если купить по разу всё из выборки"
                    />
                    <StatTile
                      label="Скидка 75% и больше"
                      value={`${Math.round(stats.kpi.deepShare * 100)}%`}
                      note="доля глубоких скидок"
                      className="col-span-2 lg:col-span-1"
                    />
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    {storeId === ALL_STORES && (
                      <>
                        <StoreCountChart stats={stats.stores} stores={storeMap} dimmed={dimmed} />
                        <StoreSavingsChart stats={stats.stores} stores={storeMap} dimmed={dimmed} />
                      </>
                    )}
                    <DiscountHistogram buckets={stats.discounts} dimmed={dimmed} />
                    <PriceHistogram buckets={stats.prices} dimmed={dimmed} />
                    <TimelineCountChart timeline={stats.timeline} dimmed={dimmed} />
                    <TimelineSavingsChart timeline={stats.timeline} dimmed={dimmed} />
                    <YearChart points={stats.years} undated={stats.undated} dimmed={dimmed} />
                    <PriceScatter deals={deals ?? []} dimmed={dimmed} />
                  </div>
                </>
                )}
    </div>
  )
}
