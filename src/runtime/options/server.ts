import type { Nuxt } from '@nuxt/schema'
import { createResolver } from '@nuxt/kit'
import { type PluginOptions, setPluginsDefaults } from './plugins'

export interface ServerOptions extends PluginOptions {}

export const serverDefaultOptions: ServerOptions = {
  pluginDirs: [],
  plugins: [],
}

export async function setServerDefaults(server: ServerOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  await setPluginsDefaults(server, nuxt, resolver.resolve(nuxt.options.serverDir, './feathers'))
}
