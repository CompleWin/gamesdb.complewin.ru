import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../../lib/cx.ts'
import { chipClass } from './button.ts'

type ChipProps = ComponentPropsWithoutRef<'button'> & {
  active?: boolean
  size?: 'sm' | 'md'
}

export function Chip ({ active = false, size = 'md', className, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cx(chipClass(active, size), className)}
      {...rest}
    />
  )
}
