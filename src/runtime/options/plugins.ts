import type { Import } from 'unimport'
import { createResolver } from '@nuxt/kit'
import { scanDirExports, scanExports } from 'unimport'
import { filterExports } from '../templates/utils'

export type PluginDir = string
export type PluginDirs = Array<PluginDir>

export type Plugin = string | Import
export type Plugins = Array<Plugin>

export type ResolvedPlugins = Array<Import>

export interface PluginOptions {
  pluginDirs?: PluginDir | PluginDirs
  plugins?: Plugin | Plugins
}

export interface ResolvedPluginOptions {
  plugins: ResolvedPlugins
}

function forceArray<T>(value?: T | T[]): T[] {
  if (!value)
    return []
  return Array.isArray(value) ? value : [value]
}

export function preparePluginOptions(pluginOptions: PluginOptions): PluginOptions {
  const { pluginDirs, plugins } = pluginOptions
  return {
    ...pluginOptions,
    pluginDirs: forceArray(pluginDirs),
    plugins: forceArray(plugins),
  }
}

export function resolvePluginDirs(pluginDirs: PluginDir | PluginDirs | undefined, rootDir: string, defaultDir: string): PluginDirs {
  const rootResolver = createResolver(rootDir)

  const resolvedPluginDirs: PluginDirs = []

  if (pluginDirs && typeof pluginDirs === 'string') {
    resolvedPluginDirs.push(pluginDirs)
  }
  else if (pluginDirs?.length) {
    resolvedPluginDirs.push(...pluginDirs)
  }
  else {
    resolvedPluginDirs.push(defaultDir)
  }

  return resolvedPluginDirs.map(dir => rootResolver.resolve(dir))
}

export async function resolvePluginsFromPluginDirs(pluginDirs: PluginDirs): Promise<ResolvedPlugins> {
  const imports = await scanDirExports(pluginDirs, {
    filePatterns: ['*.ts'],
    types: false,
  })

  const resolvedPlugins = imports.filter(filterExports)

  return resolvedPlugins
}

export async function resolvePlugins(plugins: Plugin | Plugins | undefined, rootDir: string): Promise<ResolvedPlugins> {
  if (!plugins)
    return []

  const rootResolver = createResolver(rootDir)

  const resolvedPlugins: ResolvedPlugins = []

  for (const plugin of Array.isArray(plugins) ? plugins : [plugins]) {
    if (typeof plugin === 'string') {
      const imports = await scanExports(rootResolver.resolve(plugin), false)
      resolvedPlugins.push(...imports.filter(filterExports))
    }
    else {
      resolvedPlugins.push(plugin)
    }
  }

  return resolvedPlugins
}

export async function resolvePluginsOptions(pluginOptions: PluginOptions, rootDir: string, defaultDir: string): Promise<ResolvedPluginOptions> {
  const pluginDirs = resolvePluginDirs(pluginOptions.pluginDirs, rootDir, defaultDir)
  const pluginsFromPluginDirs = await resolvePluginsFromPluginDirs(pluginDirs)

  const resolvedPlugins = await resolvePlugins(pluginOptions.plugins, rootDir)

  const resolvedPluginOptions: ResolvedPluginOptions = {
    plugins: [
      ...pluginsFromPluginDirs,
      ...resolvedPlugins,
    ],
  }

  resolvedPluginOptions.plugins = resolvedPluginOptions.plugins.filter((plugin, index, self) =>
    index === self.findIndex(p => p.from === plugin.from),
  )

  return resolvedPluginOptions
}
