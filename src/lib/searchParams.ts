import type { DealsQuery, SortBy } from '../api/types.ts'
import { isKnownTag, tagsToParams } from './tags.ts'

export const PAGE_SIZE = 30

export interface SortOption {
  id: string
  label: string
  sortBy: SortBy
  desc: 0 | 1
}

export const SORT_OPTIONS: SortOption[] = [
  { id: 'best', label: 'Лучшие предложения', sortBy: 'Deal Rating', desc: 0 },
  { id: 'price-asc', label: 'Сначала дешёвые', sortBy: 'Price', desc: 0 },
  { id: 'price-desc', label: 'Сначала дорогие', sortBy: 'Price', desc: 1 },
  { id: 'savings', label: 'Самая большая скидка', sortBy: 'Savings', desc: 0 },
  { id: 'metacritic', label: 'Рейтинг Metacritic', sortBy: 'Metacritic', desc: 0 },
  { id: 'reviews', label: 'Отзывы Steam', sortBy: 'Reviews', desc: 0 },
  { id: 'release-new', label: 'Сначала новые', sortBy: 'Release', desc: 0 },
  { id: 'release-old', label: 'Сначала старые', sortBy: 'Release', desc: 1 },
]

export const DEFAULT_SORT = SORT_OPTIONS[0]

export function findSort (id: string | null): SortOption {
  return SORT_OPTIONS.find(o => o.id === id) ?? DEFAULT_SORT
}

export interface SearchState {
  title: string
  stores: string[]
  tags: string[]
  minPrice: number | null
  maxPrice: number | null
  sort: string
  pageIndex: number
}

export const EMPTY_SEARCH: SearchState = {
  title: '',
  stores: [],
  tags: [],
  minPrice: null,
  maxPrice: null,
  sort: DEFAULT_SORT.id,
  pageIndex: 0,
}

function list (value: string | null): string[] {
  return value ? value.split(',').map(s => s.trim()).filter(Boolean) : []
}

function price (value: string | null): number | null {
  if (value === null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export function readSearch (params: URLSearchParams): SearchState {
  const page = Number(params.get('page'))
  return {
    title: params.get('q')?.trim() ?? '',
    stores: list(params.get('stores')),
    tags: list(params.get('tags')).filter(isKnownTag),
    minPrice: price(params.get('min')),
    maxPrice: price(params.get('max')),
    sort: findSort(params.get('sort')).id,
    pageIndex: Number.isInteger(page) && page > 1 ? page - 1 : 0,
  }
}

export function writeSearch (state: SearchState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.title) params.set('q', state.title)
  if (state.stores.length) params.set('stores', state.stores.join(','))
  if (state.tags.length) params.set('tags', state.tags.join(','))
  if (state.minPrice !== null) params.set('min', String(state.minPrice))
  if (state.maxPrice !== null) params.set('max', String(state.maxPrice))
  if (state.sort !== DEFAULT_SORT.id) params.set('sort', state.sort)
  if (state.pageIndex > 0) params.set('page', String(state.pageIndex + 1))
  return params
}

export function searchHref (partial: Partial<SearchState>): string {
  const query = writeSearch({ ...EMPTY_SEARCH, ...partial }).toString()
  return query ? `/search?${query}` : '/search'
}

export function activeFilterCount (state: SearchState): number {
  return state.stores.length + state.tags.length
    + (state.minPrice !== null ? 1 : 0) + (state.maxPrice !== null ? 1 : 0)
}

export function toDealsQuery (state: SearchState): DealsQuery {
  const sort = findSort(state.sort)
  const tagParams = tagsToParams(state.tags)

  const uppers = [tagParams.upperPrice, state.maxPrice ?? undefined].filter((v): v is number => v !== undefined)
  const upperPrice = uppers.length ? Math.min(...uppers) : undefined

  return {
    ...tagParams,
    title: state.title || undefined,
    storeID: state.stores.length ? state.stores.join(',') : undefined,
    lowerPrice: state.minPrice ?? undefined,
    upperPrice,
    sortBy: sort.sortBy,
    desc: sort.desc || undefined,
    pageNumber: state.pageIndex,
    pageSize: PAGE_SIZE,
  }
}
