// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html

import type { Application } from 'nuxt-feathers/runtime/declarations/server'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'

import { LocalStrategy } from '@feathersjs/authentication-local'

declare module 'nuxt-feathers/runtime/declarations/server' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

export default function authentication(app: Application) {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)
}
