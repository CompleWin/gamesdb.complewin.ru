import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../../lib/cx.ts'

type SectionLabelProps = ComponentPropsWithoutRef<'h2'> & {
  as?: 'h2' | 'h3' | 'span' | 'p'
}

export function SectionLabel ({ as: Tag = 'h2', className, ...rest }: SectionLabelProps) {
  return (
    <Tag
      className={cx('text-[11px] font-normal tracking-[0.2em] uppercase text-fg-faint', className)}
      {...rest}
    />
  )
}
