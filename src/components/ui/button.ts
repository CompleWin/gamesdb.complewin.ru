import { cx, FOCUS_RING } from '../../lib/cx.ts'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'
export type ButtonColor = 'primary' | 'black' | 'gray' | 'white'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    black: 'bg-fg text-surface-page hover:bg-primary hover:text-white',
    gray: 'bg-surface-active text-fg hover:bg-surface-strong',
    white: 'bg-white text-primary hover:bg-primary-soft',
  },
  outline: {
    primary: 'border-2 border-primary text-primary hover:bg-primary-soft',
    black: 'border-2 border-fg text-fg hover:bg-fg hover:text-surface-page',
    gray: 'border-2 border-line-strong text-fg-muted hover:border-fg hover:text-fg',
    white: 'border-2 border-white text-white hover:bg-white hover:text-primary',
  },
  ghost: {
    primary: 'text-primary hover:bg-primary-soft',
    black: 'text-fg hover:bg-surface-active',
    gray: 'text-fg-subtle hover:bg-surface-page hover:text-fg',
    white: 'text-white hover:bg-white/16',
  },
}

const ACTION_SIZES: Record<ButtonSize, string> = {
  xs: 'min-h-11 px-4 text-[11px] md:min-h-8',
  sm: 'min-h-11 px-5 text-[12px] md:min-h-[38px]',
  md: 'min-h-[46px] px-[26px] text-[13px]',
  lg: 'min-h-[52px] px-8 text-[14px]',
}

const QUIET_SIZES: Record<ButtonSize, string> = {
  xs: 'min-h-11 px-3 text-xs md:min-h-8',
  sm: 'min-h-11 px-3.5 text-sm md:min-h-[38px]',
  md: 'min-h-[46px] px-4 text-[15px]',
  lg: 'min-h-[52px] px-5 text-base',
}

export interface ButtonStyle {
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  wide?: boolean
  className?: string
}

export function buttonClass ({ variant = 'solid', color = 'primary', size = 'md', wide, className }: ButtonStyle = {}) {
  const isAction = variant !== 'ghost'
  return cx(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full no-underline transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant][color],
    isAction ? ACTION_SIZES[size] : QUIET_SIZES[size],
    isAction && 'font-extrabold tracking-[0.1em] uppercase',
    wide && 'w-full',
    FOCUS_RING,
    className,
  )
}

export function chipClass (active: boolean, size: 'sm' | 'md' = 'md') {
  return cx(
    'inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    size === 'sm' ? 'min-h-11 px-3 text-[13px] md:min-h-8' : 'min-h-11 px-3.5 text-sm md:min-h-[38px]',
    active
      ? 'border-primary bg-primary text-white hover:bg-primary-hover'
      : 'border-line bg-surface-island text-fg hover:border-primary hover:text-primary',
    FOCUS_RING,
  )
}

export function iconButtonClass (tone: 'default' | 'white' = 'default', className?: string) {
  return cx(
    'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors',
    tone === 'white'
      ? 'text-white hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2'
      : cx('text-fg-subtle hover:bg-surface-page hover:text-fg', FOCUS_RING),
    className,
  )
}
