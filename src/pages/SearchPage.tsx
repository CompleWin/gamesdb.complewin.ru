import { useState } from 'react'
import { ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'
import { Island } from '../components/ui/Island.tsx'
import { Pagination } from '../components/ui/Pagination.tsx'
import { PillSelect } from '../components/ui/PillSelect.tsx'
import { Sheet } from '../components/ui/Sheet.tsx'
import { EmptyState, ErrorState } from '../components/ui/StateIsland.tsx'
import { buttonClass, chipClass } from '../components/ui/button.ts'
import { ResultRow, ResultRowSkeleton } from '../features/search/ResultRow.tsx'
import { SearchFilters } from '../features/search/SearchFilters.tsx'
import { useSearchState } from '../features/search/useSearchState.ts'
import { useDealsSearch } from '../hooks/useDealsSearch.ts'
import { useStoreMap } from '../hooks/useStores.ts'
import { cx } from '../lib/cx.ts'
import { formatCount } from '../lib/format.ts'
import { EMPTY_SEARCH, PAGE_SIZE, SORT_OPTIONS, activeFilterCount, findSort, type SearchState } from '../lib/searchParams.ts'
import { findTag } from '../lib/tags.ts'

interface AppliedChip {
  key: string
  label: string
  remove: Partial<SearchState>
}

function useAppliedChips (state: SearchState): AppliedChip[] {
  const stores = useStoreMap()
  const chips: AppliedChip[] = []
  if (state.title) chips.push({ key: 'title', label: `«${state.title}»`, remove: { title: '' } })
  for (const id of state.tags) {
    chips.push({ key: `tag-${id}`, label: findTag(id)?.label ?? id, remove: { tags: state.tags.filter(t => t !== id) } })
  }
  for (const id of state.stores) {
    chips.push({ key: `store-${id}`, label: stores.get(id)?.name ?? `Магазин #${id}`, remove: { stores: state.stores.filter(s => s !== id) } })
  }
  if (state.minPrice !== null) chips.push({ key: 'min', label: `от $${state.minPrice}`, remove: { minPrice: null } })
  if (state.maxPrice !== null) chips.push({ key: 'max', label: `до $${state.maxPrice}`, remove: { maxPrice: null } })
  return chips
}

export function SearchPage () {
  const [state, update] = useSearchState()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useDealsSearch(state)
  const applied = useAppliedChips(state)
  const filterCount = activeFilterCount(state)

  const totalPages = data?.totalPages ?? 0
  const resetAll = () => update({ ...EMPTY_SEARCH, sort: state.sort })

  function goToPage (page: number) {
    update({ pageIndex: page - 1 })
    window.scrollTo(0, 0)
  }

  const statusLine = data
    ? data.deals.length === 0
      ? 'Ничего не найдено'
      : `Страница ${state.pageIndex + 1} из ${formatCount(Math.max(totalPages, 1))} · по ${PAGE_SIZE} предложений`
    : 'Загружаем предложения…'

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[300px_1fr]">
      <Island as="aside" aria-label="Фильтры" className="sticky top-5 hidden max-h-[calc(100dvh-40px)] overflow-y-auto lg:block">
        <SearchFilters state={state} update={update} />
      </Island>

      <div className="flex min-w-0 flex-col gap-5">
        <Island>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.035em] md:text-[44px]">
                {state.title ? <>Поиск: «{state.title}»</> : 'Поиск игр'}
              </h1>
              <p className="mt-3 text-sm text-fg-subtle" aria-live="polite">{statusLine}</p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className={cx(chipClass(filterCount > 0), 'justify-center lg:hidden')}
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                Фильтры{filterCount > 0 && ` · ${filterCount}`}
              </button>
              <PillSelect
                label="Сортировка"
                value={state.sort}
                options={SORT_OPTIONS.map(o => ({ value: o.id, label: o.label }))}
                onChange={sort => update({ sort: findSort(sort).id })}
                icon={<ArrowUpDown size={15} className="shrink-0" aria-hidden="true" />}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {applied.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {applied.map(chip => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => update(chip.remove)}
                  className={chipClass(true, 'sm')}
                  aria-label={`Убрать фильтр ${chip.label}`}
                >
                  {chip.label}
                  <X size={14} aria-hidden="true" />
                </button>
              ))}
              <button type="button" onClick={resetAll} className={buttonClass({ variant: 'ghost', color: 'gray', size: 'xs' })}>
                Сбросить всё
              </button>
            </div>
          )}
        </Island>

        {isError && !data
          ? <ErrorState error={error} onRetry={() => void refetch()} />
          : data && data.deals.length === 0
            ? (
              <EmptyState
                label="Пусто"
                title="Под такие условия ничего не нашлось."
                action={
                  <button type="button" onClick={resetAll} className={buttonClass({ variant: 'outline', color: 'black', size: 'sm' })}>
                    Сбросить фильтры
                  </button>
                }
              >
                <p className="mt-3 max-w-[54ch] text-sm text-fg-subtle">
                  Уберите часть тегов или расширьте ценовой диапазон. Название ищется по началу слов на английском.
                </p>
              </EmptyState>
              )
            : (
              <Island padded={false} className="overflow-hidden">
                <ul
                  aria-busy={isPending || isPlaceholderData}
                  className={cx('divide-y divide-line transition-opacity', isPlaceholderData && 'opacity-55')}
                >
                  {isPending || !data
                    ? Array.from({ length: 6 }, (_, i) => <ResultRowSkeleton key={i} />)
                    : data.deals.map(deal => <ResultRow key={deal.dealId} deal={deal} />)}
                </ul>
              </Island>
              )}

        <Pagination page={state.pageIndex + 1} pageCount={totalPages} onChange={goToPage} disabled={isPlaceholderData} />
      </div>

      <Sheet
        open={filtersOpen}
        title="Фильтры"
        onClose={() => setFiltersOpen(false)}
        footer={
          <button type="button" onClick={() => setFiltersOpen(false)} className={buttonClass({ wide: true, size: 'lg' })}>
            Показать результаты
          </button>
        }
      >
        <SearchFilters state={state} update={update} />
      </Sheet>
    </div>
  )
}
