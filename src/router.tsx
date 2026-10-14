import { createBrowserRouter } from 'react-router'
import { Layout } from './components/layout/Layout.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import { SearchPage } from './pages/SearchPage.tsx'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/search', element: <SearchPage /> },
      {
        path: '/game/:gameId',
        lazy: () => import('./pages/GamePage.tsx').then(m => ({ Component: m.GamePage })),
      },
      {
        path: '/analytics',
        lazy: () => import('./pages/AnalyticsPage.tsx').then(m => ({ Component: m.AnalyticsPage })),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })
