import { Bar, Line, Scatter } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import type { Deal, Store } from '../../api/types.ts'
import { ChartCard } from '../../components/ui/ChartCard.tsx'
import { BAR_STYLE, LINE_STYLE, chartColors, money, percent } from '../../lib/charts.ts'
import { formatCount, formatPrice, formatSavings, pluralize } from '../../lib/format.ts'
import type { Bucket, StoreStat, Timeline, YearPoint } from './stats.ts'

const offers = (n: number) => `${formatCount(n)} ${pluralize(n, ['предложение', 'предложения', 'предложений'])}`

interface AxisOptions {
  horizontal?: boolean
  valueTick?: (v: number | string) => string
  tooltipValue: (v: number) => string
  max?: number
}

function barOptions ({ horizontal = false, valueTick, tooltipValue, max }: AxisOptions): ChartOptions<'bar'> {
  const valueAxis = {
    beginAtZero: true,
    max,
    grid: { color: chartColors.grid },
    border: { display: false },
    ticks: { precision: 0, callback: valueTick ? (v: number | string) => valueTick(v) : undefined },
  }
  const categoryAxis = { grid: { display: false }, border: { color: chartColors.grid } }
  return {
    indexAxis: horizontal ? 'y' : 'x',
    interaction: { mode: 'index', intersect: false, axis: horizontal ? 'y' : 'x' },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => tooltipValue(Number(horizontal ? ctx.parsed.x : ctx.parsed.y)) } },
    },
    scales: horizontal ? { x: valueAxis, y: categoryAxis } : { x: categoryAxis, y: valueAxis },
  }
}

function lineOptions ({ valueTick, tooltipValue, max }: Omit<AxisOptions, 'horizontal'>): ChartOptions<'line'> {
  return {
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => tooltipValue(Number(ctx.parsed.y)) } },
    },
    scales: {
      x: { grid: { display: false }, border: { color: chartColors.grid }, ticks: { maxRotation: 0, autoSkipPadding: 12 } },
      y: {
        beginAtZero: true,
        max,
        grid: { color: chartColors.grid },
        border: { display: false },
        ticks: { callback: valueTick ? (v: number | string) => valueTick(v) : undefined },
      },
    },
  }
}

const horizontalHeight = (rows: number) => Math.max(160, rows * 30 + 36)

export function StoreCountChart ({ stats, stores, dimmed }: { stats: StoreStat[]; stores: Map<string, Store>; dimmed: boolean }) {
  const labels = stats.map(s => stores.get(s.storeId)?.name ?? `#${s.storeId}`)
  return (
    <ChartCard
      title="Где больше скидок"
      subtitle="Число предложений каждого магазина в выборке."
      height={horizontalHeight(stats.length)}
      dimmed={dimmed}
      table={{ columns: ['Магазин', 'Предложений'], rows: stats.map((s, i) => ({ label: labels[i], value: formatCount(s.count) })) }}
    >
      <Bar
        aria-label="Число предложений по магазинам"
        data={{ labels, datasets: [{ data: stats.map(s => s.count), ...BAR_STYLE }] }}
        options={barOptions({ horizontal: true, tooltipValue: offers })}
      />
    </ChartCard>
  )
}

export function StoreSavingsChart ({ stats, stores, dimmed }: { stats: StoreStat[]; stores: Map<string, Store>; dimmed: boolean }) {
  const sorted = [...stats].sort((a, b) => b.avgSavings - a.avgSavings)
  const labels = sorted.map(s => stores.get(s.storeId)?.name ?? `#${s.storeId}`)
  return (
    <ChartCard
      title="Кто скидывает сильнее"
      subtitle="Средний размер скидки по магазину."
      height={horizontalHeight(sorted.length)}
      dimmed={dimmed}
      table={{ columns: ['Магазин', 'Средняя скидка'], rows: sorted.map((s, i) => ({ label: labels[i], value: `${s.avgSavings}%` })) }}
    >
      <Bar
        aria-label="Средняя скидка по магазинам"
        data={{ labels, datasets: [{ data: sorted.map(s => s.avgSavings), ...BAR_STYLE }] }}
        options={barOptions({ horizontal: true, valueTick: percent, tooltipValue: v => `в среднем ${formatSavings(v)}`, max: 100 })}
      />
    </ChartCard>
  )
}

interface HistogramProps {
  buckets: Bucket[]
  dimmed: boolean
}

export function DiscountHistogram ({ buckets, dimmed }: HistogramProps) {
  return (
    <ChartCard
      title="Размер скидок"
      subtitle="Сколько предложений попадает в каждый диапазон скидки."
      dimmed={dimmed}
      table={{ columns: ['Скидка', 'Предложений'], rows: buckets.map(b => ({ label: b.label, value: formatCount(b.value) })) }}
    >
      <Bar
        aria-label="Распределение размера скидок"
        data={{ labels: buckets.map(b => b.label), datasets: [{ data: buckets.map(b => b.value), ...BAR_STYLE }] }}
        options={barOptions({ tooltipValue: offers })}
      />
    </ChartCard>
  )
}

export function PriceHistogram ({ buckets, dimmed }: HistogramProps) {
  return (
    <ChartCard
      title="Цены после скидки"
      subtitle="Во что обходится игра со скидкой: предложения по ценовым диапазонам."
      dimmed={dimmed}
      table={{ columns: ['Цена', 'Предложений'], rows: buckets.map(b => ({ label: b.label, value: formatCount(b.value) })) }}
    >
      <Bar
        aria-label="Распределение цен со скидкой"
        data={{ labels: buckets.map(b => b.label), datasets: [{ data: buckets.map(b => b.value), ...BAR_STYLE }] }}
        options={barOptions({ tooltipValue: offers })}
      />
    </ChartCard>
  )
}

const unitWord = (t: Timeline) => (t.unit === 'hour' ? 'по часам' : 'по дням')

export function TimelineCountChart ({ timeline, dimmed }: { timeline: Timeline; dimmed: boolean }) {
  const { points } = timeline
  return (
    <ChartCard
      title="Когда менялись цены"
      subtitle={`Сколько предложений обновилось, ${unitWord(timeline)}. Время — ваше местное.`}
      dimmed={dimmed}
      table={{ columns: ['Время', 'Обновлений'], rows: points.map(p => ({ label: p.label, value: formatCount(p.count) })) }}
    >
      <Bar
        aria-label="Число обновлений цен во времени"
        data={{ labels: points.map(p => p.label), datasets: [{ data: points.map(p => p.count), ...BAR_STYLE }] }}
        options={barOptions({ tooltipValue: offers })}
      />
    </ChartCard>
  )
}

export function TimelineSavingsChart ({ timeline, dimmed }: { timeline: Timeline; dimmed: boolean }) {
  const { points } = timeline
  return (
    <ChartCard
      title="Глубина скидок во времени"
      subtitle={`Средняя скидка среди обновившихся предложений, ${unitWord(timeline)}. Пропуски — в этот период обновлений не было.`}
      dimmed={dimmed}
      table={{
        columns: ['Время', 'Средняя скидка'],
        rows: points.map(p => ({ label: p.label, value: p.avgSavings === null ? '—' : `${p.avgSavings}%` })),
      }}
    >
      <Line
        aria-label="Средняя скидка во времени"
        data={{ labels: points.map(p => p.label), datasets: [{ data: points.map(p => p.avgSavings), ...LINE_STYLE, fill: 'origin', spanGaps: false }] }}
        options={lineOptions({ tooltipValue: v => `в среднем ${formatSavings(v)}`, valueTick: percent, max: 100 })}
      />
    </ChartCard>
  )
}

export function YearChart ({ points, undated, dimmed }: { points: YearPoint[]; undated: number; dimmed: boolean }) {
  const filled = points.filter((p): p is Bucket => p.value !== null)
  return (
    <ChartCard
      title="Старые игры дешевеют сильнее?"
      subtitle={`Средняя скидка по году выхода. Годы, где меньше трёх игр, пропущены; без даты выхода — ${Math.round(undated * 100)}% выборки.`}
      dimmed={dimmed}
      table={{ columns: ['Год выхода', 'Средняя скидка'], rows: filled.map(b => ({ label: b.label, value: `${b.value}%` })) }}
    >
      <Line
        aria-label="Средняя скидка по году выхода"
        data={{
          labels: points.map(p => p.label),
          datasets: [{ data: points.map(p => p.value), ...LINE_STYLE, fill: 'origin', spanGaps: true }],
        }}
        options={lineOptions({ tooltipValue: v => `в среднем ${formatSavings(v)}`, valueTick: percent, max: 100 })}
      />
    </ChartCard>
  )
}

export function PriceScatter ({ deals, dimmed }: { deals: Deal[]; dimmed: boolean }) {
  const points = deals.map(d => ({ x: d.normalPrice, y: d.salePrice }))
  const maxPrice = Math.ceil(Math.max(10, ...deals.map(d => d.normalPrice)) / 10) * 10

  const options: ChartOptions<'scatter'> = {
    interaction: { mode: 'nearest', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        filter: item => item.datasetIndex === 0,
        callbacks: {
          title: items => deals[items[0].dataIndex]?.title ?? '',
          label: ctx => {
            const d = deals[ctx.dataIndex]
            return d ? `${formatPrice(d.normalPrice)} → ${formatPrice(d.salePrice)} (${formatSavings(d.savings)})` : ''
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: maxPrice,
        title: { display: true, text: 'Обычная цена', color: chartColors.text },
        grid: { color: chartColors.grid },
        border: { display: false },
        ticks: { callback: money },
      },
      y: {
        beginAtZero: true,
        max: maxPrice,
        title: { display: true, text: 'Цена со скидкой', color: chartColors.text },
        grid: { color: chartColors.grid },
        border: { display: false },
        ticks: { callback: money },
      },
    },
  }

  return (
    <ChartCard
      title="Обычная цена против цены со скидкой"
      subtitle="Каждая точка — предложение. Серая диагональ — цена без скидки: чем ниже точка под ней, тем больше выгода."
      heightClass="h-80"
      dimmed={dimmed}
      table={{
        columns: ['Игра', 'Обычная → со скидкой'],
        rows: deals.map(d => ({ label: d.title, value: `${formatPrice(d.normalPrice)} → ${formatPrice(d.salePrice)}` })),
      }}
    >
      <Scatter
        aria-label="Обычная цена и цена со скидкой"
        data={{
          datasets: [
            {
              data: points,
              backgroundColor: chartColors.primary,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBorderColor: chartColors.surface,
              pointBorderWidth: 1.5,
            },
            {
              data: [{ x: 0, y: 0 }, { x: maxPrice, y: maxPrice }],
              showLine: true,
              borderColor: chartColors.muted,
              borderWidth: 1,
              pointRadius: 0,
              pointHitRadius: 0,
            },
          ],
        }}
        options={options}
      />
    </ChartCard>
  )
}
