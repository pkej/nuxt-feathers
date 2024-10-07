import type { GetContentsDataType } from './types'

export function getFeathersContents(data: GetContentsDataType): string {
  return `export function feathersLog() { console.log("Feathers contents") }`
}
