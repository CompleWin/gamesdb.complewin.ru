import { useState, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Chip } from '../../components/ui/Chip.tsx'
import { SectionLabel } from '../../components/ui/SectionLabel.tsx'
import { SkeletonBar } from '../../components/ui/Skeleton.tsx'
import { useActiveStores } from '../../hooks/useStores.ts'
import { cx, FOCUS_RING } from '../../lib/cx.ts'
import type { SearchState } from '../../lib/searchParams.ts'
import { TAG_GROUPS, toggleTag } from '../../lib/tags.ts'

const FIELD = cx(
  'w-full min-h-[46px] rounded-full border border-line-strong bg-transparent px-4 text-base text-fg',
  'placeholder:text-fg-faint focus:outline-2 focus:outline-offset-2 focus:outline-primary',
)

function FilterSection ({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <SectionLabel as="h3">{title}</SectionLabel>
      {children}
    </div>
  )
}

function TitleField ({ value, onSubmit }: { value: string; onSubmit: (title: string) => void }) {
  const [draft, setDraft] = useState(value)
  return (
    <form
      role="search"
      className="relative"
      onSubmit={e => { e.preventDefault(); onSubmit(draft.trim()) }}
    >
      <input
        type="search"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="Например, Hades"
        aria-label="Название игры"
        enterKeyHint="search"
        className={cx(FIELD, 'pr-12')}
      />
      <button
        type="submit"
        aria-label="Искать"
        title="Искать"
        className={cx(
          'absolute right-1 top-1/2 inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center',
          'rounded-full text-fg-subtle transition-colors hover:bg-primary-soft hover:text-primary',
          FOCUS_RING,
        )}
      >
        <Search size={17} aria-hidden="true" />
      </button>
    </form>
  )
}

function PriceField ({ label, value, onCommit }: { label: string; value: number | null; onCommit: (v: number | null) => void }) {
  const initial = value === null ? '' : String(value)
  const [draft, setDraft] = useState(initial)

  function commit () {
    const text = draft.trim().replace(',', '.')
    const next = text === '' ? null : Number(text)
    if (next !== null && (!Number.isFinite(next) || next < 0)) {
      setDraft(initial)
      return
    }
    if (next !== value) onCommit(next)
  }

  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-[13px] text-fg-subtle">{label}</span>
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit() }}
        inputMode="decimal"
        placeholder="$"
        className={cx(FIELD, 'tabular-nums')}
      />
    </label>
  )
}

interface SearchFiltersProps {
  state: SearchState
  update: (patch: Partial<SearchState>) => void
}

export function SearchFilters ({ state, update }: SearchFiltersProps) {
  const stores = useActiveStores()

  function toggleStore (storeId: string) {
    const stores = state.stores.includes(storeId)
      ? state.stores.filter(s => s !== storeId)
      : [...state.stores, storeId]
    update({ stores })
  }

  return (
    <div className="flex flex-col gap-7">
      <FilterSection title="Название">
        <TitleField key={state.title} value={state.title} onSubmit={title => update({ title })} />
      </FilterSection>

      <FilterSection title="Теги">
        <div className="flex flex-col gap-4">
          {TAG_GROUPS.map(group => (
            <div key={group.id} className="flex flex-col gap-2">
              <span className="text-[13px] text-fg-subtle">{group.label}</span>
              <div className="flex flex-wrap gap-2">
                {group.tags.map(tag => (
                  <Chip
                    key={tag.id}
                    size="sm"
                    title={tag.hint}
                    active={state.tags.includes(tag.id)}
                    onClick={() => update({ tags: toggleTag(state.tags, tag.id) })}
                  >
                    {tag.label}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Магазины">
        <div className="flex flex-wrap gap-2">
          {stores.length === 0
            ? Array.from({ length: 8 }, (_, i) => <SkeletonBar key={i} className="h-8 w-24" />)
            : stores.map(store => (
              <Chip key={store.storeId} size="sm" active={state.stores.includes(store.storeId)} onClick={() => toggleStore(store.storeId)}>
                <img src={store.icon} alt="" width={16} height={16} className="size-4 rounded-[3px]" loading="lazy" />
                {store.name}
              </Chip>
            ))}
        </div>
      </FilterSection>

      <FilterSection title="Цена, $">
        <div className="flex gap-3">
          <PriceField key={`min-${state.minPrice}`} label="от" value={state.minPrice} onCommit={minPrice => update({ minPrice })} />
          <PriceField key={`max-${state.maxPrice}`} label="до" value={state.maxPrice} onCommit={maxPrice => update({ maxPrice })} />
        </div>
      </FilterSection>
    </div>
  )
}
