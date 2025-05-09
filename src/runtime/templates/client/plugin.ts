import type { Import } from 'unimport'
import type { ResolvedOptions } from '../../options'
import type { DefaultAuthOptions } from '../../options/authentication'
import type { ClientOptions, ResolvedClientOptions } from '../../options/client'
import type { ServicesDirs } from '../../options/services'
import { scanDirExports } from 'unimport'
import { setImportsMeta } from '../../options/utils'
import { put } from '../utils'

async function getServices(servicesDirs: ServicesDirs): Promise<Import[]> {
  const services = await scanDirExports(servicesDirs, {
    filePatterns: ['**/*.shared.ts'],
    fileFilter: file => /\.shared\.ts$/.test(file),
    types: false,
  })
  return services.filter(({ name }) => /Client|default$/.test(name))
}

export function getClientPluginContents(options: ResolvedOptions) {
  return async (): Promise<string> => {
    const services = setImportsMeta(await getServices(options.servicesDirs))

    const plugins = (options.client as ResolvedClientOptions).plugins

    const modules = [...services, ...plugins]

    const auth = ((options?.auth as DefaultAuthOptions)?.authStrategies || []).length > 0
    const pinia = !!(options?.client as ClientOptions)?.pinia

    return `// ! Generated by nuxt-feathers - do not change manually
// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html

import { useRequestURL } from "#imports"
import type { ClientApplication } from './client'
import { feathers } from '@feathersjs/feathers'
import { defineNuxtPlugin${put(pinia, `, useRuntimeConfig`)} } from '#app'
${put(pinia, `import { createPiniaClient, type CreatePiniaClientConfig } from '@gabortorma/feathers-pinia'`)}

import { connection } from './connection'
${put(auth, `import { authentication } from './authentication'`)}

${modules.map(module => module.meta.import).join('\n')}

/**
 * Returns a typed client for the feathers-api app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
function createFeathersClient(): ClientApplication {
  const feathersClient: ClientApplication = feathers()

  // Init connection
  const { origin } = useRequestURL()
  feathersClient.configure(connection(origin))

  // Init authentication
  ${put(auth, `feathersClient.configure(authentication)`)}

  // Init services
  ${services.map(service => `feathersClient.configure(${service.meta.importId})`).join('\n  ')}

  // Init plugins
  ${plugins.map(plugin => `feathersClient.configure(${plugin.meta.importId})`).join('\n  ')}

  return feathersClient
}

/**
 * Creates a Feathers Rest client for the SSR server and a Socket.io client for the browser.
 * Also provides a cookie-storage adapter for JWT SSR using Nuxt APIs.
 */
export default defineNuxtPlugin(async (nuxt) => {
  // create the feathers client
  const feathersClient: ClientApplication = createFeathersClient()
  ${put(pinia, `
  const piniaOptions = useRuntimeConfig().public._feathers.pinia
  `)}
  // wrap the feathers client
  const api = ${put(pinia, `createPiniaClient(feathersClient, {
    ssr: !!import.meta.server,
    ...piniaOptions as CreatePiniaClientConfig,
    pinia: nuxt.$pinia,
  })`, `feathersClient`)}

  return { provide: { api } }
})
`
  }
}
