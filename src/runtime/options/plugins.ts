import type { Nuxt } from '@nuxt/schema'
import type { Import } from 'unimport'
import path from 'node:path'
import { createResolver } from '@nuxt/kit'
import { scanDirExports, scanExports } from 'unimport'

export type PluginDir = string
export type PluginDirs = Array<PluginDir>

export type Plugin = string | Import
export type Plugins = Array<Plugin>

export interface PluginOptions {
  pluginDirs?: PluginDir | PluginDirs
  plugins?: Plugin | Plugins
}

const filterExports = ({ name, from, as }: Import) => name === 'default' || new RegExp(`^${as}\w{0,2}`).test(path.basename(from, path.extname(from)))

export async function setPluginsDefaults(server: PluginOptions, nuxt: Nuxt, defaultDir: string) {
  const resolver = createResolver(import.meta.url)

  if (typeof server.pluginDirs === 'string' && server.pluginDirs)
    server.pluginDirs = [server.pluginDirs]
  if (!server.pluginDirs?.length)
    server.pluginDirs = [defaultDir]

  server.pluginDirs = (server.pluginDirs as PluginDirs).map(dir =>
    resolver.resolve(nuxt.options.rootDir, dir),
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
      ? plugins.push(...await scanExports(resolver.resolve(nuxt.options.rootDir, plugin), false))
      : plugins.push(plugin)
  }
  server.plugins = plugins
}
