import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions as PiniaModuleOptions } from '@pinia/nuxt'
import type { ModuleOptions } from '../../module'

export type PiniaOptions = Pick<PiniaModuleOptions, 'storesDirs'>

export interface ClientOptions {
  pinia?: boolean | PiniaOptions
}

export const piniaDefaultOptions: PiniaOptions = {
  storesDirs: ['stores'],
}

export const clientDefaultOptions: ClientOptions = {
  pinia: piniaDefaultOptions,
}

export function setClientsDefaults(options: ModuleOptions, nuxt: Nuxt) {
  if (options.client === true || options.client === undefined) {
    options.client = clientDefaultOptions
  }
  else if (options.client !== false) {
    if (options.client.pinia === true || options.client.pinia === undefined)
      options.client.pinia = piniaDefaultOptions
    else if (options.client.pinia !== false)
      options.client.pinia.storesDirs = piniaDefaultOptions.storesDirs
  }
}
