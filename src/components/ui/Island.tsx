import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../../lib/cx.ts'

type IslandProps = ComponentPropsWithoutRef<'section'> & {
  as?: 'section' | 'div' | 'article' | 'aside'
  padded?: boolean
}

export function Island ({ as: Tag = 'section', padded = true, className, ...rest }: IslandProps) {
  return (
    <Tag
      className={cx(
        'rounded-island border border-line bg-surface-island',
        padded && 'p-4.5 md:p-7',
        className,
      )}
      {...rest}
    />
  )
}
