import { useNuxtApp } from '#imports'

export function useFeathers() {
  const { $api: api } = useNuxtApp()
  return { api }
}
