export function cx (...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
