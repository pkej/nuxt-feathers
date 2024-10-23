import { useNuxtApp } from '#imports'
import { useAuth } from 'feathers-pinia'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const { $api } = useNuxtApp()
  const auth = useAuth({ api: $api, servicePath: 'users' }) // TODO: servicePath from config
  return auth
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
