import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions as PiniaModuleOptions } from '@pinia/nuxt'
import type { ModuleOptions } from '../../module'
import { createResolver } from '@nuxt/kit'
import { type PluginOptions, setPluginsDefaults } from './plugins'

export type PiniaOptions = Pick<PiniaModuleOptions, 'storesDirs'>

export interface ClientOptions extends PluginOptions {
  pinia?: boolean | PiniaOptions
}

export const piniaDefaultOptions: PiniaOptions = {
  storesDirs: ['stores'],
}

export const clientDefaultOptions: ClientOptions = {
  pinia: piniaDefaultOptions,
  pluginDirs: [],
  plugins: [],
}

export async function setClientDefaults(options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(nuxt.options.srcDir)

  if (options.client === true || options.client === undefined) {
    options.client = clientDefaultOptions
  }
  if (options.client !== false) {
    if (options.client.pinia === true || options.client.pinia === undefined)
      options.client.pinia = piniaDefaultOptions
    else if (options.client.pinia !== false)
      options.client.pinia.storesDirs = piniaDefaultOptions.storesDirs
    await setPluginsDefaults(options.client, nuxt, resolver.resolve('feathers'))
  }
}
