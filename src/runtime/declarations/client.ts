import type { Application, TransportConnection } from '@feathersjs/feathers'
import type { HookResult } from '@nuxt/schema'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

declare module '#app' {
  interface RuntimeNuxtHooks {
    'feathers:beforeCreate'(feathersClient: ClientApplication): HookResult
    'feathers:afterCreate'(feathersClient: ClientApplication): HookResult
  }
}
