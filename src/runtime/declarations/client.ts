import type { Application, TransportConnection } from '@feathersjs/feathers'
import type { HookResult } from '@nuxt/schema'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

declare module '#app' {
  interface RuntimeNuxtHooks {
    'feathers:beforeSetup'(feathersClient: ClientApplication): HookResult
    'feathers:afterSetup'(feathersClient: ClientApplication): HookResult
  }
  /* interface NuxtHooks {
    'feathers:beforeSetup'(): HookResult
    'feathers:afterSetup'(): HookResult
  } */
}
