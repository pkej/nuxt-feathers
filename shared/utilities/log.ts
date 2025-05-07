export const LOG_LEVEL = {
  DEBUG: 'Debug',
  WARNING: 'Warning',
  ERROR: 'Error',
} as const

export type LogLevel = keyof typeof LOG_LEVEL

export function log(message: string, level: LogLevel) {
  console.log(`${LOG_LEVEL[level]}: ${message}`)
}
  