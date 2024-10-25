import type { AuthenticationConfiguration } from '@feathersjs/authentication'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'
import type { Nuxt } from '@nuxt/schema'
import type { SignOptions } from 'jsonwebtoken'
import type { ModuleOptions } from '../../module'
import defu from 'defu'
import { sha256base64 } from 'ohash'

export type AuthStrategy = 'jwt' | 'local' // TODO: support oauth

export type AuthStrategies = [AuthStrategy] | [AuthStrategy, AuthStrategy]

export type DefaultAuthOptions = Partial<Pick<AuthenticationConfiguration, 'entity' | 'service' | 'secret' >> & {
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
  client: AuthClientOptions
}

export function authDefaultOptions(nuxt: Nuxt): DefaultAuthOptions {
  return {
    entity: 'user',
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

export function setAuthDefaults(options: ModuleOptions, nuxt: Nuxt) {
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
  console.log(options.auth)

  nuxt.options.runtimeConfig._feathers.auth = options.auth
  if (options.auth) {
    nuxt.options.runtimeConfig.public._feathers.auth = {
      authStrategies: (options.auth).authStrategies!,
      client: (options.auth).client!,
    }
  }
}
