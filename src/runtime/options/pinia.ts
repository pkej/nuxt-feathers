import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions as _PiniaModuleOptions } from '@pinia/nuxt'
import type { CreatePiniaClientConfig, PiniaServiceConfig } from 'feathers-pinia'
import type { ModuleOptions } from '../../module'
import type { ClientOptions } from './client'
import defu from 'defu'

export type PiniaModuleOptions = Pick<_PiniaModuleOptions, 'storesDirs'>

type removableOptions = 'customizeStore' | 'handleEvents' | 'setupInstance' | 'customFilters' | 'customSiftOperators'

type SerializablePiniaServiceConfig = Omit<PiniaServiceConfig, removableOptions>

type SerializablePiniaClientOptions = Partial<Omit<CreatePiniaClientConfig, 'pinia' | 'services' | 'storage' | removableOptions>> & {
  services?: Record<string, SerializablePiniaServiceConfig>
}

export type PiniaOptions = SerializablePiniaClientOptions & PiniaModuleOptions

export function getPiniaDefaultOptions(options: ModuleOptions): PiniaOptions {
  return {
    storesDirs: ['stores'],
    idField: 'id', // use _id for mongoDB
  }
}

export function setPiniaDefaults(options: ModuleOptions, nuxt: Nuxt) {
  const client = options.client as ClientOptions
  const piniaDefaultOptions = getPiniaDefaultOptions(options)
  if (client.pinia === true || client.pinia === undefined) {
    client.pinia = piniaDefaultOptions
  }
  else if (client.pinia !== false) {
    if ((client.pinia).storesDirs)
      delete piniaDefaultOptions.storesDirs
    client.pinia = defu(client.pinia, piniaDefaultOptions)
  }

  if (client.pinia)
    nuxt.options.runtimeConfig.public._feathers.pinia = client.pinia
}
