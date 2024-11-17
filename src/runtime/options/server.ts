import type { ModuleOptions } from '.'
import { createResolver } from '@nuxt/kit'
import { type PluginOptions, type ResolvedPluginOptions, resolvePluginsOptions } from './plugins'

export type ServerOptions = PluginOptions

export type ResolvedServerOptions = ResolvedPluginOptions

export const serverDefaults: ServerOptions = {
  pluginDirs: [],
  plugins: [],
}

export const serverDirDefault = 'feathers'

export async function resolveServerOptions(server: ModuleOptions['server'], rootDir: string, serverDir: string): Promise<ResolvedServerOptions> {
  const serverResolver = createResolver(serverDir)

  return resolvePluginsOptions(server, rootDir, serverResolver.resolve(serverDirDefault))
}
