import { useNuxtApp } from '#imports'

export function useFeathers() {
  const { $api } = useNuxtApp()
  return { api: $api }
}
