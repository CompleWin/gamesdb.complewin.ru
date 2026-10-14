import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '../../lib/cx.ts'

interface PillSelectProps {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  label: string
  icon?: ReactNode
  className?: string
}

export function PillSelect ({ value, options, onChange, label, icon, className }: PillSelectProps) {
  return (
    <label
      className={cx(
        'inline-flex h-[44px] max-w-full cursor-pointer items-center gap-2 rounded-full border border-line',
        'bg-surface-island pl-3.5 pr-2 text-fg-subtle transition-colors md:h-[38px]',
        'hover:border-primary hover:text-primary',
        'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary',
        className,
      )}
    >
      {icon}
      <select
        value={value}
        aria-label={label}
        onChange={e => onChange(e.target.value)}
        className="min-w-0 flex-1 cursor-pointer appearance-none truncate border-none bg-transparent pr-1 text-base text-fg outline-none md:text-sm"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={14} strokeWidth={2.5} className="mr-1.5 shrink-0 text-fg-faint" aria-hidden="true" />
    </label>
  )
}
