import type { AuthenticationConfiguration } from '@feathersjs/authentication'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../../module'
import { sha256base64 } from 'ohash'

export type DefaultAuthOptions = Partial<Pick<AuthenticationConfiguration, 'entity' | 'entityId' | 'service' | 'secret' | 'authStrategies' >>

export interface JwtOptions {
  jwtOptions?: Partial<AuthenticationConfiguration['jwtOptions']>
}

export interface LocalOptions {
  local?: Partial<AuthenticationConfiguration['local']>
}

export type AuthOptions = boolean | DefaultAuthOptions | JwtOptions | LocalOptions

export function setAuthDefaults(options: ModuleOptions, nuxt: Nuxt) {
  const devServer = nuxt.options.devServer
  if (options.auth === true || options.auth === undefined) {
    options.auth = {
      entity: 'user',
      service: 'users',
      secret: sha256base64(nuxt.options.appDir),
      authStrategies: [
        'local',
        'jwt',
      ],
      jwtOptions: {
        header: {
          typ: 'access',
        },
        audience: 'http://localhost',
        algorithm: 'HS256',
        expiresIn: '1d',
      },
      local: {
        usernameField: 'userId',
        passwordField: 'password',
      },
    }
  }
  console.log(options.auth)

  nuxt.options.runtimeConfig.auth = options.auth!
  nuxt.options.runtimeConfig.public.authStrategies = (options.auth as AuthenticationConfiguration).authStrategies
}
