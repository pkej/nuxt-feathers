import type { AuthenticationConfiguration } from '@feathersjs/authentication'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'
import type { Nuxt } from '@nuxt/schema'
import type { SignOptions } from 'jsonwebtoken'
import type { Import } from 'unimport'
import type { ModuleOptions } from '../../module'
import defu from 'defu'
import { sha256base64 } from 'ohash'

export type AuthStrategy = 'jwt' | 'local' // TODO: support oauth

export type AuthStrategies = [AuthStrategy] | [AuthStrategy, AuthStrategy]

export type DefaultAuthOptions = Partial<Pick<AuthenticationConfiguration, 'entity' | 'service' | 'secret' >> & {
  entityClass?: string
  entityImport?: Import
  authStrategies?: AuthStrategies
}

export type AuthJwtOptions = Partial<SignOptions>

export type AuthLocalOptions = Partial<Required<AuthenticationConfiguration>['local']>

export type AuthClientOptions = Partial<Omit<AuthenticationClientOptions, 'Authentication' | 'storage'>>

export type AuthOptions = (
  DefaultAuthOptions & {
    jwtOptions?: AuthJwtOptions
    local?: AuthLocalOptions
    client?: AuthClientOptions
  }
)

export interface PublicAuthOptions {
  authStrategies: AuthStrategies
  servicePath: string
  entityKey: string
  entityClass: string
  client: AuthClientOptions
}

export function authDefaultOptions(nuxt: Nuxt): DefaultAuthOptions {
  return {
    entity: 'user',
    entityClass: 'User',
    service: 'users',
    secret: sha256base64(nuxt.options.appDir),
  }
}

export const defaultAuthStrategies: AuthStrategies = ['local', 'jwt']

export const authJwtDefaultOptions: AuthJwtOptions = {
  header: {
    alg: 'HS256',
    typ: 'access',
  },
  audience: 'http://localhost',
  algorithm: 'HS256',
  expiresIn: '1d',
}

export const authLocalDefaultOptions: AuthLocalOptions = {
  usernameField: 'userId',
  passwordField: 'password',
}

export const authClientDefaultOptions: AuthClientOptions = {
  storageKey: 'feathers-jwt',
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export function setAuthDefaults(options: ModuleOptions, servicesImports: Import[], nuxt: Nuxt) {
  if (options.auth === true || options.auth === undefined) {
    options.auth = {
      ...authDefaultOptions(nuxt),
      authStrategies: defaultAuthStrategies,
      jwtOptions: authJwtDefaultOptions,
      local: authLocalDefaultOptions,
    }
    if (options.client)
      options.auth.client = authClientDefaultOptions
  }
  else if (options.auth !== false) {
    if (options.auth.entity && !options.auth.entityClass)
      options.auth.entityClass = capitalize(options.auth.entity)

    const defaultOptions = authDefaultOptions(nuxt)
    options.auth = defu(options.auth, defaultOptions)

    options.auth.authStrategies ||= defaultAuthStrategies

    if (options.auth.authStrategies.includes('jwt'))
      options.auth = defu(options.auth, { jwtOptions: authJwtDefaultOptions })
    else
      delete options.auth.jwtOptions

    if (options.auth.authStrategies!.includes('local'))
      options.auth = defu(options.auth, { local: authLocalDefaultOptions })
    else
      delete options.auth.jwtOptions

    if (options.client) {
      if (options.auth.authStrategies!.includes('jwt'))
        options.auth = defu(options.auth, { client: authClientDefaultOptions })
    }
    else {
      delete options.auth.client
    }
  }
  if (options.auth) {
    const entityClass = options.auth.entityClass
    options.auth.entityImport = servicesImports.find(i => i.as === entityClass)
    if (!options.auth.entityImport)
      throw new Error(`Entity class ${entityClass} not found in services imports`)
  }

  console.log(options.auth)

  nuxt.options.runtimeConfig._feathers.auth = options.auth
  if ((options.auth as AuthOptions).client) {
    const { authStrategies, service, entity, entityClass, client } = options.auth as Required<AuthOptions>
    nuxt.options.runtimeConfig.public._feathers.auth = {
      authStrategies,
      servicePath: service,
      entityKey: entity!,
      entityClass,
      client,
    }
  }
}
