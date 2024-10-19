import type { Nuxt } from '@nuxt/schema'
import type { FormatName } from 'ajv-formats'
import type { ModuleOptions } from '../../module'
import { createResolver } from '@nuxt/kit'

export type ValidatorFormatsOptions = Array<FormatName>

export interface ValidatorOptions {
  formats: ValidatorFormatsOptions
  extendDefaults?: boolean
}

export type ServicesDir = string
export type ServicesDirs = Array<ServicesDir>

export const servicesDirsDefaultOptions = ['services']

export function setDirectoriesDefaults(options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)

  if (typeof options.servicesDirs === 'string' && options.servicesDirs)
    options.servicesDirs = [options.servicesDirs]
  if (!options.servicesDirs?.length)
    options.servicesDirs = servicesDirsDefaultOptions

  options.servicesDirs = (options.servicesDirs as ServicesDirs).map(dir =>
    resolver.resolve(nuxt.options.rootDir, dir),
  )
}
