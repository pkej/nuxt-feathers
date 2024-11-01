import { useRuntimeConfig } from '#app'
import { useAuth } from 'feathers-pinia'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useFeathers } from '../composables/feathers'

export const useAuthStore = defineStore('auth', () => {
  const { api } = useFeathers()

  const { servicePath, entityKey } = useRuntimeConfig().public._feathers.auth!

  const auth = useAuth({ api, servicePath, entityKey })

  return auth
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
