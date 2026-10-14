import axios, { isAxiosError } from 'axios'

export const http = axios.create({
  baseURL: 'https://www.cheapshark.com/api/1.0',
  timeout: 20_000,
})

export class NotFoundError extends Error {}

export function isRateLimited (error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 429
}

export function errorMessage (error: unknown): string {
  if (isRateLimited(error)) {
    return 'CheapShark просит сделать паузу: слишком много запросов. Подождите минуту и повторите.'
  }
  if (isAxiosError(error)) {
    if (!error.response) return 'Нет связи с CheapShark. Проверьте интернет и повторите.'
    return `CheapShark ответил ошибкой ${error.response.status}.`
  }
  return 'Что-то пошло не так.'
}
