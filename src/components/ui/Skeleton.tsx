import { cx } from '../../lib/cx.ts'

export function SkeletonBar ({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx('h-3.5 animate-pulse rounded-full bg-surface-active', className)} />
}

export function SkeletonBlock ({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx('animate-pulse bg-surface-active', className)} />
}
