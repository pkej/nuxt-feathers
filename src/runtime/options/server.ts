import type { Nuxt } from '@nuxt/schema'
import { createResolver } from '@nuxt/kit'
import { type PluginOptions, setPluginsDefaults } from './plugins'

export interface ServerOptions extends PluginOptions {}

export const serverDefaultOptions: ServerOptions = {
  pluginDirs: [],
  plugins: [],
}

export async function setServerDefaults(server: ServerOptions, nuxt: Nuxt) {
  const resolver = createResolver(nuxt.options.serverDir)
  await setPluginsDefaults(server, nuxt, resolver.resolve('feathers'))
}
