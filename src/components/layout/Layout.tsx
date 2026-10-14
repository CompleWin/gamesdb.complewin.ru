import { Outlet, ScrollRestoration } from 'react-router'
import { SearchProvider } from '../../features/search/SearchProvider.tsx'
import { Footer } from './Footer.tsx'
import { Header } from './Header.tsx'

export function Layout () {
  return (
    <SearchProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-5 md:px-8 md:py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ScrollRestoration />
    </SearchProvider>
  )
}
