import { useEffect, useState } from 'react'

export function useFontReady (font: string): boolean {
  const [ready, setReady] = useState(() => document.fonts.check(font))

  useEffect(() => {
    if (ready) return
    let alive = true
    document.fonts.load(font).catch(() => undefined).finally(() => { if (alive) setReady(true) })
    return () => { alive = false }
  }, [font, ready])

  return ready
}
