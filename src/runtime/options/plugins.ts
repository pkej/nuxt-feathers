import type { Nuxt } from '@nuxt/schema'
import type { Import } from 'unimport'
import { createResolver } from '@nuxt/kit'
import { scanDirExports, scanExports } from 'unimport'
import { filterExports } from '../templates/utils'

export type PluginDir = string
export type PluginDirs = Array<PluginDir>

export type Plugin = string | Import
export type Plugins = Array<Plugin>

export interface PluginOptions {
  pluginDirs?: PluginDir | PluginDirs
  plugins?: Plugin | Plugins
}

export async function setPluginsDefaults(server: PluginOptions, nuxt: Nuxt, defaultDir: string) {
  const resolver = createResolver(nuxt.options.rootDir)

  if (typeof server.pluginDirs === 'string' && server.pluginDirs)
    server.pluginDirs = [server.pluginDirs]
  if (!server.pluginDirs?.length)
    server.pluginDirs = [defaultDir]

  server.pluginDirs = (server.pluginDirs as PluginDirs).map(dir =>
    resolver.resolve(dir),
  )

  const plugins: Plugins = [...(await scanDirExports(server.pluginDirs, {
    filePatterns: ['*.ts'],
    types: false,
  })).filter(filterExports),
  ]

  if (!Array.isArray(server.plugins)) {
    server.plugins = [server.plugins as Plugin]
  }
  for (const plugin of server.plugins) {
    (typeof plugin === 'string')
      ? plugins.push(...await scanExports(resolver.resolve(plugin), false))
      : plugins.push(plugin)
  }
  server.plugins = plugins.filter(
    (obj, index) => plugins.findIndex(plugin => (plugin as Import).from === (obj as Import).from) === index,
  )
}
