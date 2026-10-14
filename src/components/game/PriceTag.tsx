import { cx } from '../../lib/cx.ts'
import { formatPrice, formatSavings } from '../../lib/format.ts'

interface PriceTagProps {
  price: number
  normalPrice: number
  savings: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const PRICE_SIZES = {
  sm: 'text-[15px]',
  md: 'text-lg',
  lg: 'text-[34px] leading-none tracking-[-0.03em]',
} as const

export function DiscountBadge ({ savings, className }: { savings: number; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex h-6 shrink-0 items-center rounded-full bg-success-soft px-2.5',
        'text-[12px] font-extrabold tabular-nums text-success-hover',
        className,
      )}
    >
      {formatSavings(savings)}
    </span>
  )
}

export function PriceTag ({ price, normalPrice, savings, size = 'md', className }: PriceTagProps) {
  const discounted = Math.round(savings) >= 1 && normalPrice > price

  return (
    <span className={cx('inline-flex flex-wrap items-center gap-x-2 gap-y-1', className)}>
      {discounted && <DiscountBadge savings={savings} />}
      {discounted && (
        <s className="text-[13px] tabular-nums text-fg-faint">
          <span className="sr-only">Было </span>{formatPrice(normalPrice)}
        </s>
      )}
      <span className={cx('font-extrabold tabular-nums text-fg', PRICE_SIZES[size])}>
        {formatPrice(price)}
      </span>
    </span>
  )
}
