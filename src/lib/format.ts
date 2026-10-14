const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const count = new Intl.NumberFormat('ru-RU')

const dateLong = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
const dateShort = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })

export function formatPrice (value: number): string {
  return value === 0 ? 'Бесплатно' : usd.format(value)
}

export function formatMoney (value: number): string {
  return value >= 1000 ? usdCompact.format(value) : usd.format(value)
}

export function formatSavings (savings: number): string {
  return `−${Math.round(savings)}%`
}

export function formatCount (value: number): string {
  return count.format(value)
}

export function formatDate (date: Date | null): string {
  return date ? dateLong.format(date) : '—'
}

export function formatDayShort (date: Date): string {
  return dateShort.format(date).replace('.', '')
}

export function formatYear (date: Date | null): string {
  return date ? String(date.getFullYear()) : '—'
}

const STEAM_RATINGS: Record<string, string> = {
  'Overwhelmingly Positive': 'Крайне положительные',
  'Very Positive': 'Очень положительные',
  Positive: 'Положительные',
  'Mostly Positive': 'В основном положительные',
  Mixed: 'Смешанные',
  'Mostly Negative': 'В основном отрицательные',
  Negative: 'Отрицательные',
  'Very Negative': 'Очень отрицательные',
  'Overwhelmingly Negative': 'Крайне отрицательные',
}

export function steamRatingLabel (text: string | null): string {
  return (text && STEAM_RATINGS[text]) ?? text ?? 'Отзывы Steam'
}

export function pluralize (n: number, forms: [one: string, few: string, many: string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}
