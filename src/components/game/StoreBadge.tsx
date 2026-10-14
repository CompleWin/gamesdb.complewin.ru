import { Store as StoreIcon } from 'lucide-react'
import { useStoreMap } from '../../hooks/useStores.ts'
import { cx } from '../../lib/cx.ts'

export function StoreBadge ({ storeId, className }: { storeId: string; className?: string }) {
  const store = useStoreMap().get(storeId)

  return (
    <span className={cx('inline-flex min-w-0 items-center gap-1.5', className)}>
      {store
        ? <img src={store.icon} alt="" width={16} height={16} className="size-4 shrink-0 rounded-[3px]" loading="lazy" />
        : <StoreIcon size={15} className="shrink-0 text-fg-faint" aria-hidden="true" />}
      <span className="truncate">{store?.name ?? `Магазин #${storeId}`}</span>
    </span>
  )
}
