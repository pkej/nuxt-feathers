import type { Import } from 'unimport'

export type PluginDir = string
export type PluginDirs = Array<PluginDir>

export type Plugin = string | Import
export type Plugins = Array<Plugin>

export interface PluginOptions {
  pluginDirs?: PluginDir | PluginDirs
  plugins?: Plugin | Plugins
}
