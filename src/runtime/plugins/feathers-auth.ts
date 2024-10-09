import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '#imports'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  await auth.reAuthenticate()
})
