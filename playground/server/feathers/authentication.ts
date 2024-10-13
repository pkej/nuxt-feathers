// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html

import type { Application } from 'nuxt-feathers/server'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'

import { LocalStrategy } from '@feathersjs/authentication-local'

export default function authentication(app: Application) {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)
}

declare module 'nuxt-feathers/server' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}
