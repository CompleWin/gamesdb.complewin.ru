const STEAM_ASSETS = 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps'

export function steamHeader (steamAppId: string | null): string | null {
  return steamAppId ? `${STEAM_ASSETS}/${steamAppId}/header.jpg` : null
}

export function steamStoreUrl (steamAppId: string): string {
  return `https://store.steampowered.com/app/${steamAppId}/`
}
