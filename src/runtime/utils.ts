import { hash } from 'ohash'

export function safeHash(input: any): string {
  return hash(input).replace(/-/g, '')
}
