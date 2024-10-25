import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions as PiniaModuleOptions } from '@pinia/nuxt'
import type { ClientOptions } from './client'

export type PiniaOptions = Pick<PiniaModuleOptions, 'storesDirs'>

export const piniaDefaultOptions: PiniaOptions = {
  storesDirs: ['stores'],
}

export function setPiniaDefaults(client: ClientOptions, nuxt: Nuxt) {
  if (client.pinia === true || client.pinia === undefined)
    client.pinia = piniaDefaultOptions
  else if (client.pinia !== false)
    client.pinia.storesDirs = piniaDefaultOptions.storesDirs
}
