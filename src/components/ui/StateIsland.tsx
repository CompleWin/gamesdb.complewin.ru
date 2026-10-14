import type { ReactNode } from 'react'
import { errorMessage } from '../../api/client.ts'
import { cx } from '../../lib/cx.ts'
import { Island } from './Island.tsx'
import { SectionLabel } from './SectionLabel.tsx'
import { buttonClass } from './button.ts'

interface EmptyStateProps {
  label: string
  title: string
  tone?: 'muted' | 'danger'
  children?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState ({ label, title, tone = 'muted', children, action, className }: EmptyStateProps) {
  return (
    <Island className={className}>
      <SectionLabel className={cx('mb-4', tone === 'danger' && 'text-danger-ink')}>{label}</SectionLabel>
      <p className="max-w-[26ch] text-xl leading-[1.4] text-fg">{title}</p>
      {children}
      {action && <div className="mt-7">{action}</div>}
    </Island>
  )
}

export function ErrorState ({ error, onRetry, className }: { error: unknown; onRetry: () => void; className?: string }) {
  return (
    <EmptyState
      className={className}
      tone="danger"
      label="Ошибка загрузки"
      title={errorMessage(error)}
      action={
        <button type="button" className={buttonClass({ variant: 'outline', color: 'black', size: 'sm' })} onClick={onRetry}>
          Повторить
        </button>
      }
    />
  )
}
