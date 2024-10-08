import type { NuxtTemplate } from '@nuxt/schema'
import { getFeathersServerContents } from './feathers-server'

export const templates: Required<Pick<NuxtTemplate, 'filename' | 'getContents' | 'write'>>[] = [
  {
    filename: 'feathers-server.ts',
    getContents: getFeathersServerContents,
    write: true,
  },
]
