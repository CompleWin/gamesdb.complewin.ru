import { useState } from 'react'
import { Gamepad2 } from 'lucide-react'
import { cx } from '../../lib/cx.ts'
import { steamHeader } from '../../lib/images.ts'

interface GameImageProps {
  steamAppId: string | null
  thumb: string
  alt: string
  className?: string
  eager?: boolean
}

export function GameImage ({ steamAppId, thumb, alt, className, eager = false }: GameImageProps) {
  const header = steamHeader(steamAppId)
  const [failed, setFailed] = useState<Set<string>>(() => new Set())

  const src = [header, thumb].find((url): url is string => Boolean(url) && !failed.has(url!))

  if (!src) {
    return (
      <div className={cx('flex items-center justify-center bg-surface-active text-fg-disabled', className)} role="img" aria-label={alt}>
        <Gamepad2 size={28} aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      className={cx('bg-surface-active object-cover', className)}
      onError={() => setFailed(prev => new Set(prev).add(src))}
    />
  )
}
