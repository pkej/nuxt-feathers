import type { Application } from './server'

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'feathers:beforeSetup'(feathersApp: Application): Promise<void>
    'feathers:afterSetup'(feathersApp: Application): Promise<void>
  }
}
