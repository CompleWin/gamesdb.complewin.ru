import type { ReactNode } from 'react'
import { useFontReady } from '../../hooks/useFontReady.ts'
import { CHART_FONT } from '../../lib/charts.ts'
import { cx } from '../../lib/cx.ts'
import { Island } from './Island.tsx'
import { SkeletonBlock } from './Skeleton.tsx'

export interface ChartTable {
  columns: [string, string]
  rows: { label: string; value: string }[]
}

interface ChartCardProps {
  title: string
  subtitle?: string
  heightClass?: string
  height?: number
  dimmed?: boolean
  table?: ChartTable
  children: ReactNode
  className?: string
}

export function ChartCard ({ title, subtitle, heightClass = 'h-72', height, dimmed, table, children, className }: ChartCardProps) {
  const fontReady = useFontReady(CHART_FONT)

  return (
    <Island className={cx('flex min-w-0 flex-col gap-4', className)}>
      <div>
        <h2 className="text-[19px] font-extrabold leading-[1.2] tracking-[-0.02em] md:text-[22px]">{title}</h2>
        {subtitle && <p className="mt-1.5 max-w-[60ch] text-sm leading-[1.5] text-fg-subtle">{subtitle}</p>}
      </div>

      <div
        className={cx('relative min-w-0 transition-opacity', !height && heightClass, dimmed && 'opacity-55')}
        style={height ? { height } : undefined}
      >
        {fontReady ? children : <SkeletonBlock className="size-full rounded-panel" />}
      </div>

      {table && table.rows.length > 0 && (
        <details className="group">
          <summary className="inline-flex min-h-11 w-fit cursor-pointer list-none items-center rounded-full text-[11px] md:min-h-0 tracking-[0.2em] uppercase text-fg-faint transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <span className="group-open:hidden">Показать таблицей</span>
            <span className="hidden group-open:inline">Скрыть таблицу</span>
          </summary>
          <div className="mt-3 max-h-72 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2.5 text-left text-[11px] font-normal tracking-[0.16em] uppercase text-fg-faint">{table.columns[0]}</th>
                  <th className="py-2.5 pl-4 text-right text-[11px] font-normal tracking-[0.16em] uppercase text-fg-faint">{table.columns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, index) => (
                  <tr key={`${index}-${row.label}`} className="border-b border-line last:border-b-0">
                    <td className="py-2">{row.label}</td>
                    <td className="py-2 pl-4 text-right font-code tabular-nums">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </Island>
  )
}
