export interface DealDto {
  internalName: string
  title: string
  metacriticLink: string | null
  dealID: string
  storeID: string
  gameID: string
  salePrice: string
  normalPrice: string
  isOnSale: string
  savings: string
  metacriticScore: string
  steamRatingText: string | null
  steamRatingPercent: string
  steamRatingCount: string
  steamAppID: string | null
  releaseDate: number
  lastChange: number
  dealRating: string
  thumb: string
}

export interface GameSearchItemDto {
  gameID: string
  steamAppID: string | null
  cheapest: string
  cheapestDealID: string
  external: string
  internalName: string
  thumb: string
}

export interface GameLookupDto {
  info: { title: string; steamAppID: string | null; thumb: string }
  cheapestPriceEver: { price: string; date: number }
  deals: { storeID: string; dealID: string; price: string; retailPrice: string; savings: string }[]
}

export interface DealLookupDto {
  gameInfo: {
    storeID: string
    gameID: string
    name: string
    steamAppID: string | null
    salePrice: string
    retailPrice: string
    steamRatingText: string | null
    steamRatingPercent: string
    steamRatingCount: string
    metacriticScore: string
    metacriticLink: string | null
    releaseDate: number
    publisher: string | null
    steamworks: string | null
    thumb: string
  }
  cheapestPrice: { price: string; date: number }
}

export interface StoreDto {
  storeID: string
  storeName: string
  isActive: number
  images: { banner: string; logo: string; icon: string }
}

export interface Deal {
  dealId: string
  gameId: string
  storeId: string
  title: string
  salePrice: number
  normalPrice: number
  savings: number
  isOnSale: boolean
  metacritic: number
  steamRatingText: string | null
  steamRatingPercent: number
  steamRatingCount: number
  steamAppId: string | null
  releaseDate: Date | null
  lastChange: Date | null
  dealRating: number
  thumb: string
}

export interface GameSearchItem {
  gameId: string
  steamAppId: string | null
  title: string
  cheapest: number
  cheapestDealId: string
  thumb: string
}

export interface GameOffer {
  dealId: string
  storeId: string
  price: number
  retailPrice: number
  savings: number
}

export interface Game {
  gameId: string
  title: string
  steamAppId: string | null
  thumb: string
  cheapestEver: { price: number; date: Date | null }
  offersByPrice: GameOffer[]
}

export interface DealDetails {
  gameId: string
  title: string
  publisher: string | null
  releaseDate: Date | null
  metacritic: number
  metacriticLink: string | null
  steamRatingText: string | null
  steamRatingPercent: number
  steamRatingCount: number
  steamworks: boolean
}

export interface Store {
  storeId: string
  name: string
  isActive: boolean
  icon: string
  logo: string
}

export type SortBy =
  | 'Deal Rating'
  | 'Title'
  | 'Savings'
  | 'Price'
  | 'Metacritic'
  | 'Reviews'
  | 'Release'
  | 'Store'
  | 'Recent'

export interface DealsQuery {
  title?: string
  storeID?: string
  sortBy?: SortBy
  desc?: 0 | 1
  pageNumber?: number
  pageSize?: number
  lowerPrice?: number
  upperPrice?: number
  metacritic?: number
  steamRating?: number
  onSale?: 0 | 1
  AAA?: 0 | 1
  steamworks?: 0 | 1
}

export interface DealsPage {
  deals: Deal[]
  totalPages: number
}
