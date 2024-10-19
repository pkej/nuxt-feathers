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

export type JwtOptions = Partial<SignOptions>

export type LocalOptions = Partial<Required<AuthenticationConfiguration>['local']>

export type ClientOptions = Partial<Omit<AuthenticationClientOptions, 'Authentication' | 'storage'>>

export type AuthOptions = (
  DefaultAuthOptions & {
    jwtOptions?: JwtOptions
    local?: LocalOptions
    client?: ClientOptions
  }
)

export interface PublicAuthOptions {
  authStrategies: AuthStrategies
  client: ClientOptions
}

export function authDefaultOptions(nuxt: Nuxt): DefaultAuthOptions {
  return {
    entity: 'user',
    service: 'users',
    secret: sha256base64(nuxt.options.appDir),
  }
}

export const defaultAuthStrategies: AuthStrategies = ['local', 'jwt']

export const jwtDefaultOptions: JwtOptions = {
  header: {
    alg: 'HS256',
    typ: 'access',
  },
  audience: 'http://localhost',
  algorithm: 'HS256',
  expiresIn: '1d',
}

export const localDefaultOptions: LocalOptions = {
  usernameField: 'userId',
  passwordField: 'password',
}

export const clientDefaultOptions: ClientOptions = {
  storageKey: 'feathers-jwt',
}

export function setAuthDefaults(options: ModuleOptions, nuxt: Nuxt) {
  if (options.auth === true || options.auth === undefined) {
    options.auth = {
      ...authDefaultOptions(nuxt),
      authStrategies: defaultAuthStrategies,
      jwtOptions: jwtDefaultOptions,
      local: localDefaultOptions,
      client: clientDefaultOptions,
    }
  }
  else if (options.auth !== false) {
    const defaultOptions = authDefaultOptions(nuxt)
    options.auth = defu(options.auth, defaultOptions)
    options.auth.authStrategies ||= defaultAuthStrategies

    if (options.auth.authStrategies.includes('jwt'))
      options.auth = defu(options.auth, { jwtOptions: jwtDefaultOptions })
    else
      delete options.auth.jwtOptions

    if (options.auth.authStrategies!.includes('local'))
      options.auth = defu(options.auth, { local: localDefaultOptions })
    else
      delete options.auth.jwtOptions

    options.auth = defu(options.auth, { client: clientDefaultOptions })
  }
  console.log(options.auth)

  nuxt.options.runtimeConfig.auth = options.auth!
  if (options.auth) {
    nuxt.options.runtimeConfig.public.auth = {
      authStrategies: (options.auth).authStrategies!,
      client: (options.auth).client!,
    }
  }
}
