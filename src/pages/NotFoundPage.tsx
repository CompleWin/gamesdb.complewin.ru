import { Link } from 'react-router'
import { EmptyState } from '../components/ui/StateIsland.tsx'
import { buttonClass } from '../components/ui/button.ts'

export function NotFoundPage () {
  return (
    <EmptyState
      label="404"
      title="Такой страницы нет. Возможно, игру уже сняли с продажи."
      action={<Link to="/" className={buttonClass()}>На главную</Link>}
    />
  )
}
