export class NuxtFeathersError extends Error {
  constructor(message?: string) {
    super(`[nuxt-feathers]: ${message}`)
  }
}
