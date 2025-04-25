import type { Nuxt } from '@nuxt/schema'
import type { AuthOptions, PublicAuthOptions, ResolvedAuthOptions, ResolvedAuthOptionsOrDisabled } from './authentication'
import type { ClientOptions, ResolvedClientOptions, ResolvedClientOptionsOrDisabled } from './client'
import type { PiniaOptions } from './client/pinia'
import type { DataBaseOptions, ResolvedDataBaseOptions } from './database'
import type { ResolvedServerOptions, ServerOptions } from './server'
import type { ServicesDir, ServicesDirs } from './services'
import type { ResolvedTransportsOptions, TransportsOptions } from './transports'
import type { ResolvedValidatorOptions, ValidatorOptions } from './validator'
import { getServicesImports } from '../services'
import { resolveAuthOptions } from './authentication'
import { resolveClientOptions } from './client'
import { resolveDataBaseOptions } from './database'
import { resolveServerOptions } from './server'
import { resolveServicesDirs } from './services'
import { resolveTransportsOptions } from './transports'
import { resolveValidatorOptions } from './validator'

// Module options TypeScript interface definition
export interface ModuleOptions {
  transports: TransportsOptions
  database: DataBaseOptions
  servicesDirs: ServicesDir | ServicesDirs
  server: ServerOptions
  auth: AuthOptions | boolean
  client: ClientOptions | boolean
  validator: ValidatorOptions
  loadFeathersConfig: boolean
}

export interface ResolvedOptions {
  transports: ResolvedTransportsOptions
  database: ResolvedDataBaseOptions
  servicesDirs: ServicesDirs
  server: ResolvedServerOptions
  auth: ResolvedAuthOptionsOrDisabled
  client: ResolvedClientOptionsOrDisabled
  validator: ResolvedValidatorOptions
  loadFeathersConfig: boolean
}

export interface FeathersRuntimeConfig {
  auth?: ResolvedAuthOptions
}

export interface FeathersPublicRuntimeConfig {
  transports: ResolvedTransportsOptions
  auth?: PublicAuthOptions
  pinia?: PiniaOptions
}

export type ModuleConfig = Partial<Omit<ModuleOptions, 'auth'> & {
  auth: Omit<AuthOptions, 'entityImport'> | boolean
}>

export async function resolveOptions(options: ModuleOptions, nuxt: Nuxt): Promise<ResolvedOptions> {
  const { rootDir, srcDir, serverDir, appDir, ssr } = nuxt.options

  const transports = resolveTransportsOptions(options.transports, ssr)
  const database = resolveDataBaseOptions(options.database)
  const servicesDirs = resolveServicesDirs(options.servicesDirs, rootDir)
  const server = await resolveServerOptions(options.server, rootDir, serverDir)
  const client = await resolveClientOptions(options.client, !!database.mongo, rootDir, srcDir)
  const validator = resolveValidatorOptions(options.validator)
  const servicesImports = await getServicesImports(servicesDirs) // TODO move
  const auth = resolveAuthOptions(options.auth, !!client, servicesImports, appDir)
  const loadFeathersConfig = options.loadFeathersConfig

  const resolvedOptions = {
    transports,
    database,
    servicesDirs,
    server,
    client,
    validator,
    auth,
    loadFeathersConfig,
  }
  console.dir(resolvedOptions, { depth: null })
  return resolvedOptions
}

export function resolveRuntimeConfig(options: ResolvedOptions): FeathersRuntimeConfig {
  const runtimeConfig: FeathersRuntimeConfig = { }

  if (options.auth) {
    runtimeConfig.auth = options.auth
  }

  return runtimeConfig
}

export function resolvePublicRuntimeConfig(options: ResolvedOptions): FeathersPublicRuntimeConfig {
  const publicRuntimeConfig: FeathersPublicRuntimeConfig = {
    transports: options.transports,
  }
  const auth = options.auth as ResolvedAuthOptions
  if (auth?.client) {
    publicRuntimeConfig.auth = {
      authStrategies: auth.authStrategies,
      servicePath: auth.service,
      entityKey: auth.entity,
      entityClass: auth.entityClass,
      client: auth.client,
    }
  }
  const client = options.client as ResolvedClientOptions
  if (client?.pinia) {
    publicRuntimeConfig.pinia = client.pinia
  }

  return publicRuntimeConfig
}

/*
    await setServerDefaults(options.server, nuxt)
    await setClientDefaults(options, nuxt)
    setTransportsDefaults(options.transports, nuxt)
    setValidatorFormatsDefaults(options.validator, nuxt)

    const servicesImports = await getServicesImports(options.servicesDirs as ServicesDirs)
    await addServicesImports(servicesImports)

    setAuthDefaults(options, servicesImports, nuxt)
*/
