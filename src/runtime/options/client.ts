import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../../module'
import { createResolver } from '@nuxt/kit'
import { type PiniaOptions, setPiniaDefaults } from './pinia'
import { type PluginOptions, setPluginsDefaults } from './plugins'

export interface ClientOptions extends PluginOptions {
  pinia?: boolean | PiniaOptions
}

export const clientDefaultOptions: ClientOptions = {
  pinia: true,
  pluginDirs: [],
  plugins: [],
}

export async function setClientDefaults(options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(nuxt.options.srcDir)

  if (options.client === true || options.client === undefined) {
    options.client = clientDefaultOptions
  }
  if (options.client !== false) {
    setPiniaDefaults(options, nuxt)
    await setPluginsDefaults(options.client, nuxt, resolver.resolve('feathers'))
  }
}
