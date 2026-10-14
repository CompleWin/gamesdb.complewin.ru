import type {
  Deal,
  DealDetails,
  DealDto,
  DealLookupDto,
  Game,
  GameLookupDto,
  GameSearchItem,
  GameSearchItemDto,
  Store,
  StoreDto,
} from './types.ts'

const CHEAPSHARK_ORIGIN = 'https://www.cheapshark.com'

function num (value: string | number | null | undefined): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function unixDate (seconds: number | null | undefined): Date | null {
  // CheapShark даёт дату в секундах, JS надо в миллисекундах
  return seconds ? new Date(seconds * 1000) : null
}

function steamAppId (value: string | null | undefined): string | null {
  return value && value !== '0' ? value : null
}

export function toDeal (dto: DealDto): Deal {
  return {
    dealId: dto.dealID,
    gameId: dto.gameID,
    storeId: dto.storeID,
    title: dto.title,
    salePrice: num(dto.salePrice),
    normalPrice: num(dto.normalPrice),
    savings: num(dto.savings),
    isOnSale: dto.isOnSale === '1',
    metacritic: num(dto.metacriticScore),
    steamRatingText: dto.steamRatingText,
    steamRatingPercent: num(dto.steamRatingPercent),
    steamRatingCount: num(dto.steamRatingCount),
    steamAppId: steamAppId(dto.steamAppID),
    releaseDate: unixDate(dto.releaseDate),
    lastChange: unixDate(dto.lastChange),
    dealRating: num(dto.dealRating),
    thumb: dto.thumb,
  }
}

export function toGameSearchItem (dto: GameSearchItemDto): GameSearchItem {
  return {
    gameId: dto.gameID,
    steamAppId: steamAppId(dto.steamAppID),
    title: dto.external,
    cheapest: num(dto.cheapest),
    cheapestDealId: dto.cheapestDealID,
    thumb: dto.thumb,
  }
}

export function toGame (gameId: string, dto: GameLookupDto): Game {
  const offersByPrice = dto.deals
    .map(d => ({
      dealId: d.dealID,
      storeId: d.storeID,
      price: num(d.price),
      retailPrice: num(d.retailPrice),
      savings: num(d.savings),
    }))
    .sort((a, b) => a.price - b.price)

  return {
    gameId,
    title: dto.info.title,
    steamAppId: steamAppId(dto.info.steamAppID),
    thumb: dto.info.thumb,
    cheapestEver: { price: num(dto.cheapestPriceEver.price), date: unixDate(dto.cheapestPriceEver.date) },
    offersByPrice,
  }
}

export function toDealDetails (dto: DealLookupDto): DealDetails {
  const info = dto.gameInfo
  return {
    gameId: info.gameID,
    title: info.name,
    publisher: info.publisher && info.publisher !== 'N/A' ? info.publisher : null,
    releaseDate: unixDate(info.releaseDate),
    metacritic: num(info.metacriticScore),
    metacriticLink: info.metacriticLink,
    steamRatingText: info.steamRatingText,
    steamRatingPercent: num(info.steamRatingPercent),
    steamRatingCount: num(info.steamRatingCount),
    steamworks: info.steamworks === '1',
  }
}

export function toStore (dto: StoreDto): Store {
  return {
    storeId: dto.storeID,
    name: dto.storeName,
    isActive: dto.isActive === 1,
    icon: CHEAPSHARK_ORIGIN + dto.images.icon,
    logo: CHEAPSHARK_ORIGIN + dto.images.logo,
  }
}

export function dealRedirectUrl (dealId: string): string {
  return `${CHEAPSHARK_ORIGIN}/redirect?dealID=${dealId}`
}
