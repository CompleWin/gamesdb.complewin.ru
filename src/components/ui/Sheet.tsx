import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.ts'
import { iconButtonClass } from './button.ts'

interface SheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Sheet ({ open, title, onClose, children, footer }: SheetProps) {
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex flex-col bg-surface-page">
      <div className="flex items-center justify-between gap-4 bg-primary py-1.5 pl-4 pr-1.5 text-white">
        <span className="text-[13px] font-extrabold tracking-[0.12em] uppercase">{title}</span>
        <button type="button" className={iconButtonClass('white')} onClick={onClose} aria-label="Закрыть" title="Закрыть">
          <X size={21} aria-hidden="true" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      {footer && <div className="border-t border-line bg-surface-island p-4">{footer}</div>}
    </div>,
    document.body,
  )
}
