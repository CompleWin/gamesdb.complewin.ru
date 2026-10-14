import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

const FIVE_MINUTES = 5 * 60 * 1000

function shouldRetry (failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false
  if (!isAxiosError(error)) return false
  const status = error.response?.status
  return status === undefined || status >= 500 || status === 429
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
      gcTime: 30 * 60 * 1000,
      retry: shouldRetry,
      retryDelay: attempt => Math.min(1500 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
    },
  },
})
