import type { ClientApplication } from '../../declarations/client'
import { useCookie, useRuntimeConfig } from '#app'
import authenticationClient, { type AuthenticationClientOptions } from '@feathersjs/authentication-client'
import defu from 'defu'

export function authentication(client: ClientApplication) {
  const { auth } = useRuntimeConfig().public

  if (!auth)
    return

  const authOptions = defu(auth.client) as AuthenticationClientOptions

  if (auth.authStrategies.includes('jwt')) {
  // Store JWT in a cookie for SSR.
    const jwt = useCookie<string | null>(authOptions.storageKey)
    const storage = {
      getItem: () => jwt.value,
      setItem: (key: string, val: string) => (jwt.value = val),
      removeItem: () => (jwt.value = null),
    }
    authOptions.storage = storage
  }

  client.configure(authenticationClient(authOptions))
}
