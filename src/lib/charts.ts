import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  Tooltip,
} from 'chart.js'

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  Tooltip,
)

function token (name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}

export const chartColors = {
  primary: token('--brand-700', '#1B2FE0'),
  primaryWash: 'rgba(27, 47, 224, 0.10)',
  muted: token('--neutral-500', '#8A8785'),
  grid: token('--neutral-200', '#EAE9E9'),
  text: token('--neutral-600', '#66635F'),
  ink: token('--neutral-900', '#201E1D'),
  surface: '#FFFFFF',
}

export const CHART_FONT = "12px 'Golos Text'"

Chart.defaults.font.family = "'Golos Text', system-ui, sans-serif"
Chart.defaults.font.size = 12
Chart.defaults.color = chartColors.text
Chart.defaults.borderColor = chartColors.grid
Chart.defaults.maintainAspectRatio = false
Chart.defaults.animation = { duration: 180 }

Object.assign(Chart.defaults.plugins.tooltip, {
  backgroundColor: chartColors.ink,
  titleColor: '#FFFFFF',
  bodyColor: '#FFFFFF',
  padding: 10,
  cornerRadius: 10,
  caretSize: 5,
  displayColors: false,
  titleFont: { weight: 'normal', size: 12 },
  bodyFont: { weight: 'bold', size: 14 },
})

export const BAR_STYLE = {
  backgroundColor: chartColors.primary,
  hoverBackgroundColor: token('--brand-800', '#1728BE'),
  borderRadius: 4,
  borderSkipped: 'start' as const,
  maxBarThickness: 24,
}

export const LINE_STYLE = {
  borderColor: chartColors.primary,
  backgroundColor: chartColors.primaryWash,
  borderWidth: 2,
  borderCapStyle: 'round' as const,
  borderJoinStyle: 'round' as const,
  pointRadius: 4,
  pointHoverRadius: 6,
  pointBackgroundColor: chartColors.primary,
  pointBorderColor: chartColors.surface,
  pointBorderWidth: 2,
  pointHitRadius: 12,
  tension: 0.25,
}

export const money = (v: number | string) => `$${Number(v).toLocaleString('en-US')}`
export const percent = (v: number | string) => `${v}%`
