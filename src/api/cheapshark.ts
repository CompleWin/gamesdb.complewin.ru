import { http, NotFoundError } from './client.ts'
import { toDeal, toDealDetails, toGame, toGameSearchItem, toStore } from './normalize.ts'
import type {
  DealDetails,
  DealDto,
  DealLookupDto,
  DealsPage,
  DealsQuery,
  Game,
  GameLookupDto,
  GameSearchItem,
  GameSearchItemDto,
  Store,
  StoreDto,
} from './types.ts'

export async function getDeals (query: DealsQuery, signal?: AbortSignal): Promise<DealsPage> {
  const response = await http.get<DealDto[]>('/deals', { params: query, signal })
  const totalPages = Number(response.headers['x-total-page-count'] ?? 0)
  return {
    deals: response.data.map(toDeal),
    totalPages: Number.isFinite(totalPages) ? totalPages : 0,
  }
}

export async function getDealDetails (dealId: string, signal?: AbortSignal): Promise<DealDetails> {
  const response = await http.get<DealLookupDto>('/deals', {
    params: { id: decodeURIComponent(dealId) },
    signal,
  })
  return toDealDetails(response.data)
}

export async function searchGames (title: string, limit = 10, signal?: AbortSignal): Promise<GameSearchItem[]> {
  const response = await http.get<GameSearchItemDto[]>('/games', { params: { title, limit }, signal })
  return response.data.map(toGameSearchItem)
}

export async function getGame (gameId: string, signal?: AbortSignal): Promise<Game> {
  const response = await http.get<GameLookupDto | []>('/games', {
    params: { id: gameId },
    signal,
    validateStatus: status => status === 200 || status === 404,
  })
  const { status, data } = response
  if (status === 404 || Array.isArray(data) || !data?.info) throw new NotFoundError(`game ${gameId}`)
  return toGame(gameId, data)
}

export async function getStores (signal?: AbortSignal): Promise<Store[]> {
  const response = await http.get<StoreDto[]>('/stores', { signal })
  return response.data.map(toStore)
}
