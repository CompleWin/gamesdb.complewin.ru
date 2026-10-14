import type { DealsQuery } from '../api/types.ts'

export type TagParams = Pick<DealsQuery, 'upperPrice' | 'metacritic' | 'steamRating' | 'onSale' | 'AAA' | 'steamworks'>

export interface TagDef {
  id: string
  label: string
  hint: string
  params: TagParams
}

export interface TagGroup {
  id: string
  label: string
  exclusive: boolean
  tags: TagDef[]
}

export const TAG_GROUPS: TagGroup[] = [
  {
    id: 'flags',
    label: 'Особенности',
    exclusive: false,
    tags: [
      { id: 'sale', label: 'Со скидкой', hint: 'Только предложения со скидкой', params: { onSale: 1 } },
      { id: 'aaa', label: 'AAA', hint: 'Обычная цена выше $29', params: { AAA: 1 } },
      { id: 'steamworks', label: 'Steamworks', hint: 'Активируется в Steam', params: { steamworks: 1 } },
    ],
  },
  {
    id: 'price',
    label: 'Цена',
    exclusive: true,
    tags: [
      { id: 'free', label: 'Бесплатно', hint: 'Раздачи за $0', params: { upperPrice: 0 } },
      { id: 'under5', label: 'До $5', hint: 'Цена не выше $5', params: { upperPrice: 5 } },
      { id: 'under10', label: 'До $10', hint: 'Цена не выше $10', params: { upperPrice: 10 } },
      { id: 'under20', label: 'До $20', hint: 'Цена не выше $20', params: { upperPrice: 20 } },
    ],
  },
  {
    id: 'metacritic',
    label: 'Metacritic',
    exclusive: true,
    tags: [
      { id: 'mc70', label: 'Metacritic 70+', hint: 'Оценка критиков от 70', params: { metacritic: 70 } },
      { id: 'mc85', label: 'Metacritic 85+', hint: 'Оценка критиков от 85', params: { metacritic: 85 } },
    ],
  },
  {
    id: 'steam',
    label: 'Отзывы Steam',
    exclusive: true,
    tags: [
      { id: 'steam80', label: 'Steam 80%+', hint: 'Не меньше 80% положительных отзывов', params: { steamRating: 80 } },
      { id: 'steam95', label: 'Steam 95%+', hint: 'Не меньше 95% положительных отзывов', params: { steamRating: 95 } },
    ],
  },
]

const TAGS_BY_ID = new Map(TAG_GROUPS.flatMap(g => g.tags.map(t => [t.id, { tag: t, group: g }] as const)))

export function findTag (id: string): TagDef | undefined {
  return TAGS_BY_ID.get(id)?.tag
}

export function isKnownTag (id: string): boolean {
  return TAGS_BY_ID.has(id)
}

export function toggleTag (selected: string[], id: string): string[] {
  if (selected.includes(id)) return selected.filter(t => t !== id)
  const entry = TAGS_BY_ID.get(id)
  if (!entry) return selected
  const siblings = entry.group.exclusive ? new Set(entry.group.tags.map(t => t.id)) : new Set<string>()
  return [...selected.filter(t => !siblings.has(t)), id]
}

export function tagsToParams (ids: string[]): TagParams {
  const params: TagParams = {}
  for (const id of ids) Object.assign(params, findTag(id)?.params)
  return params
}

export const QUICK_TAGS = ['free', 'under5', 'aaa', 'mc85', 'steam95', 'sale']
