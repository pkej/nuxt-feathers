import { useNuxtApp, useRuntimeConfig } from '#app'
import { useAuth } from 'feathers-pinia'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const { $api } = useNuxtApp()

  const { servicePath, entityKey } = useRuntimeConfig().public._feathers.auth!

  const auth = useAuth({ api: $api, servicePath, entityKey })

  return auth
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
