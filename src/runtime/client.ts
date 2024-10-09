// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html

import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'
import type { TransportConnection } from '@feathersjs/feathers'
// ! TODO: Fix this import
// eslint-disable-next-line antfu/no-import-dist
import type { ClientApplication, ServiceTypes } from '../../dist/runtime/declarations/client'
// ! TODO: Fix this import

import authenticationClient from '@feathersjs/authentication-client'

import { feathers } from '@feathersjs/feathers'

/**
 * Returns a typed client for the feathers-api app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export function createClient<Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {},
): ClientApplication {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  return client
}
